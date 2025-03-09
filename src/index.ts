import { Plugin,PluginOption } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Plugin Options Interface
type BundleStatsOptions = {
    outputFile?: string; // Custom file output path
    format?: 'json' | 'txt' | 'csv'; // Output format
    logToConsole?: boolean | 'summary' | 'detailed'; // Console log behavior
    warnThreshold?: number; // Warn if bundle size exceeds this (in KiB)
};



function bundleStatsMetrics(options: BundleStatsOptions = {}): PluginOption {

    const isProd = process.env.NODE_ENV === 'production';
    const jsonFilePath = options.outputFile || join(process.cwd(), isProd ? 'bundle-stats-prod.json' : 'bundle-stats-dev.json');
    let buildStartTime = 0;
    let totalBuildTime = 0;

    function extractSizeInfo(bundle: Record<string, any>) {
        const extensionsMap: Record<string, { name: string; extension: string; value: number; unit: 'KiB' }> = {};
        let assetsSizeInBytes = 0;
        let bundleSizeInBytes = 0;
        let largestFileExtension = { name: 'Largest file size', value: 0, extension: '', unit: 'KiB' };

        Object.keys(bundle).forEach((filePath) => {
            const extension = filePath.split('.').pop() ?? '';
            if (extension && !extensionsMap[extension]) {
                extensionsMap[extension] = { name: `.${extension} files size`, extension, value: 0, unit: 'KiB' };
            }
            
            const asset = bundle[filePath];
            let fileSizeInBytes = 0;

            if (asset) {
                if (typeof asset.source === 'string') fileSizeInBytes = Buffer.byteLength(asset.source, 'utf8');
                else if (Buffer.isBuffer(asset.source)) fileSizeInBytes = asset.source.length;
                else if (asset.source instanceof Uint8Array) fileSizeInBytes = asset.source.byteLength;
                else if ('code' in asset && typeof asset.code === 'string') fileSizeInBytes = Buffer.byteLength(asset.code, 'utf8');
                
                assetsSizeInBytes += fileSizeInBytes;
                bundleSizeInBytes += fileSizeInBytes;

                const fileSizeInKiB = parseFloat((fileSizeInBytes / 1024).toFixed(2));
                if (largestFileExtension.value < fileSizeInKiB) {
                    largestFileExtension = { name: 'Largest file size', extension, value: fileSizeInKiB, unit: 'KiB' };
                }
                extensionsMap[extension].value = parseFloat((extensionsMap[extension].value + fileSizeInKiB).toFixed(2));
            }
        });

        return {
            largestChunk: largestFileExtension,
            assets: { value: parseFloat((assetsSizeInBytes / 1024).toFixed(2)), name: 'Assets size', extension: '', unit: 'KiB' },
            extensions: extensionsMap,
            bundle: { value: parseFloat((bundleSizeInBytes / 1024).toFixed(2)), name: 'Bundle size including assets', extension: '', unit: 'KiB' },
            buildTime: { value: totalBuildTime, name: 'Build time', extension: '', unit: 'seconds' }
        };
    }

    function writeOutputToFile(data: object, filePath: string, format: 'json' | 'txt' | 'csv') {
        let content: string = ''; // Initialize with an empty string
    
        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
        } else if (format === 'txt') {
            content = Object.entries(data)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join('\n');
        } else if (format === 'csv') {
            content = 'Metric,Value\n' + 
                Object.entries(data)
                .map(([key, value]) => `${key},${JSON.stringify(value)}`)
                .join('\n');
        }
    
        // Ensure content is always a string before writing to the file
        writeFileSync(filePath, content || '', 'utf8');
    }
    

    return {
        name: 'bundle-stats-metrics',
        apply: 'build',
        buildStart() {
            buildStartTime = Date.now();
        },
        buildEnd() {
            totalBuildTime = (Date.now() - buildStartTime) / 1000;
        },
        generateBundle(_, bundle) {
                     if (!isProd) return; // Run only in production mode
            const stats = extractSizeInfo(bundle);
            writeOutputToFile(stats, jsonFilePath, options.format || 'json');

            // Log summary/detailed stats
            if (options.logToConsole === 'summary') {
                console.log(`\n📊 Bundle Size: ${stats.bundle.value} KiB`);
            } else if (options.logToConsole === 'detailed') {
                console.log('\n📊 Bundle Stats:\n', stats);
            }

            // Check bundle size threshold warning
            if (options.warnThreshold && stats.bundle.value > options.warnThreshold) {
                console.warn(`⚠️ Warning: Bundle size (${stats.bundle.value} KiB) exceeds the threshold of ${options.warnThreshold} KiB`);
            }
        },
    } as Plugin; // ✅ Explicitly cast as Plugin
}

export default bundleStatsMetrics;

