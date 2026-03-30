import { expect, test, } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
});

test.describe('Issues Feauture Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://app-mms.baumnest.com/MQZUKKX7TLD/issues'
    );
  })

// Test Case : President only issues 


test('Create a president only issues',async()=>{

})

})
