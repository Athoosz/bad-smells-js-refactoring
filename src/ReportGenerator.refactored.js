export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const report = [this.createHeader(reportType, user)];
    let total = 0;

    for (const item of items) {
      if (user.role === 'ADMIN' && item.value > 1000) {
        item.priority = true;
      }

      if (!this.shouldIncludeItem(user, item)) {
        continue;
      }

      const line = this.createItemLine(reportType, user, item);
      if (line) {
        report.push(line);
        total += item.value;
      }
    }

    report.push(this.createFooter(reportType, total));
    return report.join('').trim();
  }

  createHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return [
        '<html><body>\n',
        '<h1>Relatório</h1>\n',
        `<h2>Usuário: ${user.name}</h2>\n`,
        '<table>\n',
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n',
      ].join('');
    }

    return '';
  }

  shouldIncludeItem(user, item) {
    return user.role === 'ADMIN'
      || (user.role === 'USER' && item.value <= 500);
  }

  createItemLine(reportType, user, item) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }

    if (reportType === 'HTML') {
      const style = user.role === 'ADMIN' && item.priority
        ? ' style="font-weight:bold;"'
        : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    return '';
  }

  createFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }

    return '';
  }
}
