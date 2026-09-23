export const whatsappNumber='918320404132';
// Conservative encoded URL allowance; full brief is always available to copy.
export const whatsappUrlBudget=1800;
export function whatsappHandoff(reference:string,summary:string,number=whatsappNumber){
 const full='https://wa.me/'+number+'?text='+encodeURIComponent(summary);
 const short='https://wa.me/'+number+'?text='+encodeURIComponent('RivyaLivingArt — inquiry '+reference+'. My complete brief and references are saved in your Studio. I will paste the full summary here.');
 return {whatsappUrl:full.length<=whatsappUrlBudget?full:short,copyRequired:full.length>whatsappUrlBudget};
}
