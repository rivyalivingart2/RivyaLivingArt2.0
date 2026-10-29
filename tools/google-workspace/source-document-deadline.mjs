/** One monotonic operation deadline, including synchronous work between awaits. */
import {performance} from 'node:perf_hooks';
const checks=new WeakMap();
export class SourceDocumentDeadlineError extends Error {constructor(code){super('Source document deadline: '+code+'.');this.code=code;}}
export function checkSourceDocumentSignal(signal){
  if(signal?.aborted)throw new SourceDocumentDeadlineError('ABORTED');
  checks.get(signal)?.();
}
export function sourceDocumentDeadline(milliseconds,outer){
  const end=performance.now()+milliseconds,controller=new AbortController();let expired=false;
  const abort=()=>controller.abort();
  const check=()=>{
    checkSourceDocumentSignal(outer);
    if(expired||performance.now()>=end){expired=true;controller.abort();throw new SourceDocumentDeadlineError('TIMEOUT');}
    if(controller.signal.aborted)throw new SourceDocumentDeadlineError('ABORTED');
  };
  check();outer?.addEventListener('abort',abort,{once:true});checks.set(controller.signal,check);
  const timer=setTimeout(()=>{expired=true;controller.abort();},milliseconds);
  return {signal:controller.signal,check,
    async run(work){
      check();
      const result=await new Promise((resolve,reject)=>{
        const aborted=()=>reject(new SourceDocumentDeadlineError(expired?'TIMEOUT':'ABORTED'));
        controller.signal.addEventListener('abort',aborted,{once:true});
        Promise.resolve().then(()=>{check();return work();}).then(resolve,reject).finally(()=>controller.signal.removeEventListener('abort',aborted));
      });
      check();return result;
    },
    close(){clearTimeout(timer);outer?.removeEventListener('abort',abort);controller.abort();checks.delete(controller.signal);},
  };
}
