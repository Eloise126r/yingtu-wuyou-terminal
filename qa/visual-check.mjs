import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/LXR-Lily/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const outDir = path.join(process.cwd(), 'qa', 'screenshots-v2')
const baseUrl = 'http://127.0.0.1:4180'
const errors = []
const checks = {}

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
page.on('pageerror', (error) => errors.push(`page: ${error.message}`))

await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
checks.brand = await page.getByText('影途无忧', { exact: true }).isVisible()
checks.homeViewport = await viewportAudit(page)
checks.demoCases = await page.getByRole('button', { name: '切换演示病例' }).count() === 1
await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true })

await page.getByRole('button', { name: '扫码签到', exact: false }).click()
await page.getByRole('button', { name: '开始模拟扫码' }).click()
await page.getByText('签到成功').waitFor({ timeout: 5000 })
await page.waitForURL('**/patient', { timeout: 5000 })
checks.initialEta = await page.getByText('15–20').isVisible()
checks.patientProgress = await page.getByText('当前检查进度').isVisible()
await page.screenshot({ path: path.join(outDir, '02-patient.png'), fullPage: true })

await page.getByRole('button', { name: /检查前准备/ }).last().click()
await page.waitForURL('**/preparation')
checks.knowledgePage = await page.getByText('胸部 CT 平扫', { exact: true }).first().isVisible()
await page.screenshot({ path: path.join(outDir, '03-preparation.png'), fullPage: true })
await page.getByRole('button', { name: '去除金属', exact: true }).click()
checks.metalIllustrationRemoved = await page.getByText(/去金属示意图/).count() === 0
await page.screenshot({ path: path.join(outDir, '03b-metal.png'), fullPage: true })
await page.getByRole('button', { name: /我已阅读本次准备/ }).click()
await page.waitForURL('**/preparation-summary')

await page.goto(`${baseUrl}/safety`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '没有', exact: true }).click()
await page.getByRole('button', { name: /提交安全确认/ }).click()
await page.waitForURL('**/preparation-summary')

await page.goto(`${baseUrl}/training`, { waitUntil: 'networkidle' })
checks.trainingIllustration = await page.locator('img[src="/assets/training/ct-chest.png"]').isVisible()
checks.trainingIllustrationLoaded = await page.locator('img[src="/assets/training/ct-chest.png"]').evaluate((image) => image.complete && image.naturalWidth > 0)
await page.screenshot({ path: path.join(outDir, '04-training.png'), fullPage: true })
await page.getByRole('button', { name: '开始屏气练习' }).click()
await page.getByText('练习完成').waitFor({ timeout: 15000 })
await page.screenshot({ path: path.join(outDir, '04-training-complete.png'), fullPage: true })
await page.getByRole('button', { name: /我已完成本次学习/ }).click()
await page.waitForURL('**/preparation-summary')
await page.waitForTimeout(1000)
checks.summaryUrl = page.url()
checks.summaryRendered = await page.evaluate(() => document.body.innerText.includes('本次准备状态'))
await page.screenshot({ path: path.join(outDir, '04b-preparation-summary.png'), fullPage: true })
checks.prepared = await page.evaluate(() => document.body.innerText.includes('准备完成') && !document.body.innerText.includes('准备进行中'))
checks.preparationFlags = await page.evaluate(() => {
  const stored = JSON.parse(localStorage.getItem('yingtu-terminal-session-v2') || '{}')
  const item = stored.sessions?.[stored.selectedId]
  return item ? {
    preparation: item.preparationCompleted,
    safety: item.safetyCheckCompleted,
    position: item.positionTrainingCompleted,
    breathing: item.breathingTrainingCompleted,
    prepared: item.prepared,
  } : null
})

await page.goto(`${baseUrl}/ai`, { waitUntil: 'networkidle' })
checks.faqCount = await page.getByText('60 条知识').isVisible()
const input = page.getByPlaceholder('例如：增强CT需要空腹吗？')
await input.fill('我有心脏起搏器能不能做MR？')
await input.press('Enter')
checks.aiYellow = await page.getByText('需要工作人员确认 MR 兼容条件。').isVisible()
await page.screenshot({ path: path.join(outDir, '05-ai-risk.png'), fullPage: true })

await page.goto(`${baseUrl}/waiting`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /模拟急诊优先/ }).click()
await page.getByRole('button', { name: /模拟急诊患者插入/ }).click()
await page.getByRole('button', { name: /确认并同步/ }).click()
checks.emergencyEta = await page.getByText('25–30分钟', { exact: true }).isVisible()
checks.miniProgramSync = await page.getByText('影途无忧手机端通知已同步').isVisible()
await page.screenshot({ path: path.join(outDir, '06-emergency.png'), fullPage: true })
await page.getByRole('button', { name: /返回等待状态/ }).click()
await page.getByRole('button', { name: /前方减少 1 人/ }).click()
await page.getByRole('button', { name: /前方减少 1 人/ }).click()
checks.nextReminder = await page.getByText('下一位可能就是您，请做好进入检查室的准备。').isVisible()
await page.getByRole('button', { name: /正式叫号/ }).click()
checks.calling = await page.evaluate(() => location.pathname === '/calling' && document.body.innerText.includes('正在叫号'))
await page.screenshot({ path: path.join(outDir, '07-calling.png'), fullPage: true })

await page.getByRole('button', { name: '返回公共屏' }).click()
await page.getByRole('button', { name: '长辈模式' }).click()
checks.elderMode = await page.evaluate(() => document.documentElement.classList.contains('elder-mode'))
checks.finalViewport = await viewportAudit(page)

await browser.close()
const failedChecks = Object.entries(checks).filter(([, value]) => value === false || (typeof value === 'object' && value.scrollWidth > value.clientWidth))
console.log(JSON.stringify({ checks, errors, failedChecks }, null, 2))
if (errors.length || failedChecks.length) process.exitCode = 1

async function viewportAudit(target) {
  return target.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }))
}
