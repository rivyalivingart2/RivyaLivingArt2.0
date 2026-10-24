/** RFC-style quoted CSV accounting. Does not return record values. */
export function summarizeCsv(text){
 let quoted=false,afterQuote=false,cell='',row=[],headers,records=0,nonconformingRows=0;
 const emit=()=>{row.push(cell);cell='';if(row.some(v=>v!=='')){if(!headers)headers=row;else{records++;if(row.length!==headers.length)nonconformingRows++;}}row=[];};
 for(let i=text.charCodeAt(0)===0xfeff?1:0;i<text.length;i++){
  const ch=text[i];
  if(quoted){if(ch==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;afterQuote=true;}}else cell+=ch;continue;}
  if(ch===','){row.push(cell);cell='';afterQuote=false;}
  else if(ch==='\r'||ch==='\n'){emit();afterQuote=false;if(ch==='\r'&&text[i+1]==='\n')i++;}
  else if(ch==='"'&&cell===''&&!afterQuote)quoted=true;
  else{if(afterQuote)throw Error('Unexpected character after a quoted CSV value');cell+=ch;}
 }
 if(quoted)throw Error('Unclosed quoted CSV value');
 if(cell!==''||row.length||afterQuote)emit();
 return {records,columns:headers?.length||0,headers:headers||[],nonconformingRows};
}
