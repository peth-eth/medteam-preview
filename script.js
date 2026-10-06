const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');
const companyYears=document.querySelector('#company-years');
if(companyYears){
  const [year,month,day]=companyYears.dataset.foundedDate.split('-').map(Number);
  const today=new Date();
  const beforeAnniversary=today.getMonth()+1<month||(today.getMonth()+1===month&&today.getDate()<day);
  companyYears.textContent=String(Math.max(0,today.getFullYear()-year-Number(beforeAnniversary)));
}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const dialog=document.querySelector('#request-dialog');
const openers=document.querySelectorAll('[data-open-request]');
const closeButton=dialog.querySelector('.modal-close');
let lastTrigger=null;
openers.forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  lastTrigger=link;
  if(submitButton.hidden){
    form.querySelector('.form-grid').hidden=false;
    form.querySelector('.form-note').hidden=false;
    submitButton.hidden=false;
  }
  status.textContent='';
  fallback.hidden=true;
  const preset=link.dataset.requester;
  if(preset)dialog.querySelector('select[name="requester"]').value=preset;
  dialog.showModal();
  dialog.querySelector('input[name="name"]').focus();
}));
closeButton.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>lastTrigger?.focus());

const form=document.querySelector('#request-form');
const status=document.querySelector('#form-status');
const fallback=document.querySelector('#form-fallback');
const submitButton=form.querySelector('button[type="submit"]');
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  submitButton.disabled=true;
  submitButton.textContent='Sending…';
  status.textContent='Sending your request to MedTeam…';
  fallback.hidden=true;
  try{
    const payload=Object.fromEntries(new FormData(form));
    const result=await fetch('https://medteam-contact.pethereum.workers.dev/request',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    });
    const body=await result.json();
    if(!result.ok)throw new Error(body.message||'Delivery failed');
    status.textContent='Your request was sent to MedTeam. The team will contact you directly.';
    form.reset();
    form.querySelector('.form-grid').hidden=true;
    form.querySelector('.form-note').hidden=true;
    submitButton.hidden=true;
  }catch(error){
    status.textContent=error.message||'The request could not be sent.';
    fallback.hidden=false;
  }finally{
    submitButton.disabled=false;
    if(!submitButton.hidden)submitButton.textContent='Send request';
  }
});
