# 📊 Vite Bundle Stats Metrics Plugin

A **Vite plugin** that provides detailed **bundle size statistics** for your project. It generates a report in **JSON, CSV, or TXT format** and can optionally display the results in the console.

## 🚀 Features
- 📂 Generates **bundle size report** after build
- 📝 Supports **JSON, CSV, and TXT** output formats
- 📊 Logs **summary or detailed stats** in the console
- ⚠️ Supports **warnings for large bundle sizes**
- ✅ Works only in **production mode** to avoid development clutter

---

## 📦 Installation

Install via npm:
```sh
npm install vite-bundle-stats-metrics --save-dev
```

Or using yarn:
```sh
yarn add vite-bundle-stats-metrics --dev
```

---

## 🛠 Usage

In your **`vite.config.ts`**, import and add the plugin:

```ts
import { defineConfig, PluginOption } from 'vite';
import bundleStatsMetrics from 'vite-bundle-stats-metrics';

export default defineConfig({
  plugins: [
    bundleStatsMetrics({
      outputFile: 'dist/bundle-stats.json',
      format: 'json', // Available options: 'json' | 'txt' | 'csv'
      logToConsole: 'summary', // 'summary' | 'detailed' | false
      warnThreshold: 500 // KiB - Logs a warning if exceeded
    })  as PluginOption
  ]
});
```

---

## ⚙️ Options

| Option         | Type                                | Default                  | Description |
|---------------|-----------------------------------|--------------------------|-------------|
| `outputFile`  | `string`                           | `'bundle-stats.json'`    | Path for the output file. The extension changes based on `format`. |
| `format`      | `'json'` \| `'txt'` \| `'csv'`    | `'json'`                 | Format of the output file. |
| `logToConsole`| `boolean` \| `'summary'` \| `'detailed'` | `false`        | Logs bundle stats in console as a summary or detailed report. |
| `warnThreshold` | `number`                         | `undefined`              | Logs a warning if the bundle size exceeds this threshold in KiB. |

---

## 🛠 Why This Plugin is Useful

### 📊 **Insights from the Output**

1. **Identify the Largest File in Your Bundle**
   - Example: `"largestChunk": { "name": "Largest file size", "extension": "js", "value": 198.01, "unit": "KiB" }`
   - Helps optimize large JavaScript or CSS files to improve performance.

2. **Understand Asset Size Distribution**
   - Example: `"assets": { "value": 367.66, "name": "Assets size", "extension": "", "unit": "KiB" }`
   - Gives insight into how much total space is taken by assets.

3. **Analyze File Type Breakdown**
   - Example: `"extensions": { "css": { "name": ".css files size", "extension": "css", "value": 169.65, "unit": "KiB" }, "js": { "name": ".js files size", "extension": "js", "value": 198.01, "unit": "KiB" } }`
   - Helps pinpoint if JavaScript, CSS, or other files are bloating the bundle.

4. **Monitor Bundle Size for Performance Optimization**
   - Example: `"bundle": { "value": 367.66, "name": "Bundle size including assets", "extension": "", "unit": "KiB" }`
   - Useful for tracking bundle size growth over time.

5. **Track Build Time for Performance Analysis**
   - Example: `"buildTime": { "value": 2.179, "name": "Build time", "extension": "", "unit": "seconds" }`
   - Helps developers identify slow builds and improve build performance.

---

## 📝 Example Output

### **JSON Output (`bundle-stats.json`)**
```json
{
  "largestChunk": { "name": "Largest file size", "extension": "js", "value": 198.01, "unit": "KiB" },
  "assets": { "value": 367.66, "name": "Assets size", "extension": "", "unit": "KiB" },
  "extensions": {
    "css": { "name": ".css files size", "extension": "css", "value": 169.65, "unit": "KiB" },
    "js": { "name": ".js files size", "extension": "js", "value": 198.01, "unit": "KiB" }
  },
  "bundle": { "value": 367.66, "name": "Bundle size including assets", "extension": "", "unit": "KiB" },
  "buildTime": { "value": 2.179, "name": "Build time", "extension": "", "unit": "seconds" }
}
```

### **Console Output (Summary)**
```sh
📊 Bundle Size: 367.66 KiB
```

### **Console Output (Detailed)**
```sh
📊 Bundle Stats:
{
  largestChunk: { name: 'Largest file size', extension: 'js', value: 198.01, unit: 'KiB' },
  assets: { value: 367.66, name: 'Assets size', extension: '', unit: 'KiB' },
  extensions: {
    css: { name: '.css files size', extension: 'css', value: 169.65, unit: 'KiB' },
    js: { name: '.js files size', extension: 'js', value: 198.01, unit: 'KiB' }
  },
  bundle: { value: 367.66, name: 'Bundle size including assets', extension: '', unit: 'KiB' },
  buildTime: { value: 2.179, name: 'Build time', extension: '', unit: 'seconds' }
}
```

---

## 🛠 Development & Contributions

Want to contribute? Feel free to **open an issue** or **submit a pull request**! 🚀

---

## 📜 License

This project is licensed under the **MIT License**.

---

### 💡 **Enjoying this plugin? Consider starring it on GitHub!** 🌟