import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const origin='https://www.up-informatica.ch';
const files=readdirSync('.').filter(x=>x.endsWith('.html'));
const titles=new Set();
for(const file of files){
 const html=readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file+': one H1');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 assert(title&&!titles.has(title),file+': unique title');titles.add(title);
 assert(/<meta name="description" content="[^"]{30,}"/.test(html),file+': description');
 assert(html.includes('lang="it-CH"'),file+': language');
 const canonical=origin+(file==='index.html'?'/':'/'+file);
 assert(html.includes('rel="canonical" href="'+canonical+'"'),file+': canonical');
 for(const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(m[1]);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=m[1];
  if(!url.startsWith('/')&&!url.startsWith('#'))continue;
  const [path,hash]=url.split('#');
  const local=path?(path==='/'?'index.html':path.slice(1)):file;
  assert(existsSync(resolve(local)),file+': missing '+url);
  if(hash)assert(readFileSync(local,'utf8').includes('id="'+hash+'"'),file+': missing anchor '+url);
 }
 if(file!=='404.html')assert(readFileSync('sitemap.xml','utf8').includes('<loc>'+canonical+'</loc>'),file+': sitemap entry');
 assert(!html.includes('your-fontawesome-kit'),file+': placeholder script');
 assert(!html.includes('favicon.png'),file+': absent favicon');
 assert(!html.includes('streetAddress'),file+': no invented public office');
}
assert(readFileSync('robots.txt','utf8').includes(origin+'/sitemap.xml'));
assert(readFileSync('index.html','utf8').includes('https://formspree.io/f/mgvyvvjw'));
const script=readFileSync('script.js','utf8');
async function testForm(outcome){
 let submit,resets=0,calls=0;
 const button={disabled:false};
 const status={dataset:{},textContent:''};
 const form={action:'https://formspree.io/f/mgvyvvjw',addEventListener:(name,fn)=>{if(name==='submit')submit=fn},querySelector:()=>button,reportValidity:()=>true,setAttribute(){},removeAttribute(){},reset(){resets++}};
 const document={documentElement:{classList:{add(){}}},querySelector:s=>s==='#contact-form'?form:s==='#form-messages'?status:null,addEventListener(){}};
 const context={document,window:{},FormData:class{get(){return ''}},AbortController,setTimeout,clearTimeout,fetch:async()=>{calls++;if(outcome==='network')throw Error('offline');return {ok:outcome==='success'}}};
 vm.runInNewContext(script,context);
 await submit({preventDefault(){}});
 assert.equal(calls,1);assert.equal(button.disabled,false);
 assert.equal(resets,outcome==='success'?1:0,'failed submissions preserve fields');
 assert.equal(status.dataset.state,outcome==='success'?'success':'error');
}
await testForm('success');await testForm('server-error');await testForm('network');
console.log('PASS: '+files.length+' pages, internal links, anchors, metadata, sitemap, structured data; form success/server/network failure.');
