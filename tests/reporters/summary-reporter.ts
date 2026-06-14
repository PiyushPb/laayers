import type { Reporter, Vitest } from 'vitest';

export default class SummaryReporter implements Reporter {
  private ctx!: Vitest;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  onTestRunEnd() {
    const files = this.ctx.state.getFiles();
    let total = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    const failedList: string[] = [];

    function collect(tasks: any[], suiteName = '') {
      for (const t of tasks) {
        const fullName = suiteName ? `${suiteName} > ${t.name}` : t.name;
        if (t.type === 'test') {
          total++;
          if (t.result?.state === 'pass') {
            passed++;
          } else if (t.result?.state === 'fail') {
            failed++;
            failedList.push(fullName);
          } else {
            skipped++;
          }
        } else if (t.tasks) {
          collect(t.tasks, fullName);
        }
      }
    }

    for (const file of files) {
      if (file.tasks) {
        collect(file.tasks);
      }
    }

    const border = '┌──────────────────────────────────────────────┐';
    const bottomBorder = '└──────────────────────────────────────────────┘';
    const divider = '├──────────────────────────────────────────────┤';

    this.ctx.logger.log(`\n\x1b[1m\x1b[36m${border}\x1b[0m`);
    this.ctx.logger.log('\x1b[1m\x1b[36m│               VITEST SUMMARY                 │\x1b[0m');
    this.ctx.logger.log(`\x1b[1m\x1b[36m${divider}\x1b[0m`);
    this.ctx.logger.log(`│  Total Tests :  ${String(total).padEnd(28)} │`);
    this.ctx.logger.log(`│  Passed      :  \x1b[32m${String(passed).padEnd(28)}\x1b[0m │`);
    this.ctx.logger.log(`│  Failed      :  \x1b[31m${String(failed).padEnd(28)}\x1b[0m │`);
    if (skipped > 0) {
      this.ctx.logger.log(`│  Skipped     :  ${String(skipped).padEnd(28)} │`);
    }
    this.ctx.logger.log(`\x1b[1m\x1b[36m${bottomBorder}\x1b[0m\n`);

    if (failed > 0) {
      this.ctx.logger.log('\x1b[1m\x1b[31m❌ Failed Tests:\x1b[0m');
      for (const name of failedList) {
        this.ctx.logger.log(`  - \x1b[31m${name}\x1b[0m`);
      }
      this.ctx.logger.log();
    }
  }
}
