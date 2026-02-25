#!/usr/bin/env node
/**
 * JSON to Table CLI
 * JSON verisini terminalde tablo formatında gösterir
 * @author turkcoode
 */

function jsonToTable(data, options = {}) {
  if (!Array.isArray(data)) {
    if (typeof data === 'object' && data !== null) {
      data = [data];
    } else {
      return String(data);
    }
  }

  if (data.length === 0) return '(bos veri)';

  let fields = options.fields;
  if (!fields) {
    const allKeys = new Set();
    data.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
    fields = Array.from(allKeys);
  }

  if (options.sort && fields.includes(options.sort)) {
    data.sort((a, b) => {
      const va = a[options.sort], vb = b[options.sort];
      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      return String(va).localeCompare(String(vb), 'tr');
    });
  }

  if (options.limit && options.limit > 0) {
    data = data.slice(0, options.limit);
  }

  // Sütun genişlikleri
  const widths = {};
  fields.forEach(f => { widths[f] = f.length; });
  data.forEach(row => {
    fields.forEach(f => {
      const val = row[f] !== undefined && row[f] !== null ? String(row[f]) : '';
      widths[f] = Math.max(widths[f], val.length);
    });
  });

  // Markdown format
  if (options.markdown) {
    let out = '| ' + fields.map(f => f.padEnd(widths[f])).join(' | ') + ' |\n';
    out += '| ' + fields.map(f => '-'.repeat(widths[f])).join(' | ') + ' |\n';
    data.forEach(row => {
      out += '| ' + fields.map(f => {
        const val = row[f] !== undefined && row[f] !== null ? String(row[f]) : '';
        return val.padEnd(widths[f]);
      }).join(' | ') + ' |\n';
    });
    return out.trim();
  }

  // CSV format
  if (options.csv) {
    let out = fields.join(',') + '\n';
    data.forEach(row => {
      out += fields.map(f => {
        const val = row[f] !== undefined && row[f] !== null ? String(row[f]) : '';
        return val.includes(',') ? '"' + val + '"' : val;
      }).join(',') + '\n';
    });
    return out.trim();
  }

  // Tablo format
  const line = (left, mid, right, fill) => {
    return left + fields.map(f => fill.repeat(widths[f] + 2)).join(mid) + right;
  };

  let out = '';
  out += line('┌', '┬', '┐', '─') + '\n';

  if (options.noHeader !== true) {
    out += '│ ' + fields.map(f => f.padEnd(widths[f])).join(' │ ') + ' │\n';
    out += line('├', '┼', '┤', '─') + '\n';
  }

  data.forEach(row => {
    out += '│ ' + fields.map(f => {
      const val = row[f] !== undefined && row[f] !== null ? String(row[f]) : '';
      return val.padEnd(widths[f]);
    }).join(' │ ') + ' │\n';
  });

  out += line('└', '┴', '┘', '─') + '\n';
  out += data.length + ' kayit';

  return out;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  let inputFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--fields' && args[i+1]) { options.fields = args[++i].split(','); }
    else if (args[i] === '--sort' && args[i+1]) { options.sort = args[++i]; }
    else if (args[i] === '--limit' && args[i+1]) { options.limit = parseInt(args[++i]); }
    else if (args[i] === '--no-header') { options.noHeader = true; }
    else if (args[i] === '--csv') { options.csv = true; }
    else if (args[i] === '--markdown') { options.markdown = true; }
    else if (!args[i].startsWith('-')) { inputFile = args[i]; }
  }

  const processInput = (input) => {
    try {
      const data = JSON.parse(input);
      console.log(jsonToTable(data, options));
    } catch (e) {
      console.error('JSON parse hatasi:', e.message);
      process.exit(1);
    }
  };

  if (inputFile) {
    const fs = require('fs');
    processInput(fs.readFileSync(inputFile, 'utf8'));
  } else if (!process.stdin.isTTY) {
    let input = '';
    process.stdin.on('data', chunk => input += chunk);
    process.stdin.on('end', () => processInput(input));
  } else {
    console.log('Kullanim: json-table <dosya.json>');
    console.log('  veya: cat data.json | json-table');
    console.log('\nSecenekler:');
    console.log('  --fields ad,yas   Belirli alanlar');
    console.log('  --sort yas        Siralamaa');
    console.log('  --limit 10        Maks satir');
    console.log('  --csv             CSV cikti');
    console.log('  --markdown        Markdown cikti');
  }
}

module.exports = { jsonToTable };
