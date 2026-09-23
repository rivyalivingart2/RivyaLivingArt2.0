// Conservative encoded URL allowance; full brief is always available to copy.
export const whatsappUrlBudget=1800;
export function whatsappHandoff(reference:string,summary:string,number:string){
 if(!/^[1-9]\d{9,14}$/.test(number)||!reference.trim()||!summary.trim())throw Error('Saved order handoff is incomplete');
 const full='https://wa.me/'+number+'?text='+encodeURIComponent(summary);
 const short='https://wa.me/'+number+'?text='+encodeURIComponent('RivyaLivingArt — inquiry '+reference+'. My complete brief and references are saved in your Studio. I will paste the full summary here.');
 return {whatsappUrl:full.length<=whatsappUrlBudget?full:short,copyRequired:full.length>whatsappUrlBudget};
}
