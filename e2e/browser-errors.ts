import type {ConsoleMessage,Page} from '@playwright/test';

// Only a test's exact intentional HTTP failure may suppress Chrome's resource
// diagnostic. Application console errors (including hydration) always fail.
export const resourceErrorKey=(url:string,status:number)=>`${status}:${url}`;
export function isExpectedResourceError(message:string,url:string,expected:Set<string>){
 const match=/^Failed to load resource: the server responded with a status of (\d{3})(?:\s*\([^)]*\))?$/.exec(message);
 return Boolean(match&&expected.has(resourceErrorKey(url,Number(match[1]))));
}
export function collectBrowserErrors(page:Page,expected=new Set<string>()){
 const errors:string[]=[];
 const onPageError=(error:Error)=>errors.push(`pageerror: ${error.message}`);
 const onConsole=(message:ConsoleMessage)=>{
  if(message.type()==='error'&&!isExpectedResourceError(message.text(),message.location().url,expected))errors.push(`console.error: ${message.text()}`);
 };
 page.on('pageerror',onPageError);
 page.on('console',onConsole);
 return {errors,stop(){page.off('pageerror',onPageError);page.off('console',onConsole);}};
}
