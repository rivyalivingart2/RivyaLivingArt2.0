import {test,expect} from '@playwright/test';
import {collectBrowserErrors,isExpectedResourceError,resourceErrorKey} from './browser-errors';

test('browser guard captures console hydration errors and exceptions and cleans up listeners',async({page})=>{
 const expected=new Set([resourceErrorKey('http://127.0.0.1:4173/intentional',503)]);
 const guard=collectBrowserErrors(page,expected);
 try{
  await page.setContent('<p>Browser error guard regression</p>');
  await page.evaluate(()=>{
   console.error('Hydration failed: intentional guard regression');
   console.warn('A warning is not an error');
   setTimeout(()=>{throw new Error('Intentional uncaught guard regression');},0);
  });
  await expect.poll(()=>guard.errors.length).toBe(2);
  expect(guard.errors).toContain('console.error: Hydration failed: intentional guard regression');
  expect(guard.errors).toContain('pageerror: Intentional uncaught guard regression');
  const resourceMessage='Failed to load resource: the server responded with a status of 503 (Service Unavailable)';
  expect(isExpectedResourceError(resourceMessage,'http://127.0.0.1:4173/intentional',expected)).toBe(true);
  expect(isExpectedResourceError(resourceMessage,'http://127.0.0.1:4173/unexpected',expected)).toBe(false);
  expect(isExpectedResourceError('Hydration failed','http://127.0.0.1:4173/intentional',expected)).toBe(false);
  expect(isExpectedResourceError(resourceMessage.replace('503','500'),'http://127.0.0.1:4173/intentional',expected)).toBe(false);
 }finally{guard.stop();}
 await page.evaluate(()=>console.error('Listener has been detached'));
 expect(guard.errors).toHaveLength(2);
});
