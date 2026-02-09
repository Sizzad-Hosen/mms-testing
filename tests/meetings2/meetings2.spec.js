import { test, } from '@playwright/test';

// 🔐 authenticated session
test.use({
  storageState: 'storageState.json',
});
