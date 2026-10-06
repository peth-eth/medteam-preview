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
openers.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();lastTrigger=link;dialog.showModal();dialog.querySelector('input[name="name"]').focus()}));
closeButton.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>lastTrigger?.focus());

const form=document.querySelector('#request-form');
form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const fields=new FormData(form);
  const lines=[
    'Patient transfer request',
    '',
    `Name: ${fields.get('name')}`,
    `Email: ${fields.get('email')}`,
    `Phone: ${fields.get('phone')}`,
    `Request from: ${fields.get('requester')}`,
    `Transport type: ${fields.get('service')}`,
    `Patient location: ${fields.get('origin')}`,
    `Destination: ${fields.get('destination')}`,
    `Preferred date: ${fields.get('date') || 'To be confirmed'}`,
    '',
    'Please contact me to discuss the patient and transport needs.'
  ];
  const subject=`Patient transfer request: ${fields.get('origin')} to ${fields.get('destination')}`;
  document.querySelector('#form-fallback').hidden=false;
  window.location.href=`mailto:ops@medteamintl.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
});
