document.addEventListener('DOMContentLoaded',()=>{
 const db=window.XcontentSupabase;
 if(!db)return;
 const message=document.getElementById('authMessage');
 const show=text=>{if(message)message.textContent=text;};
 const login=document.getElementById('loginForm');
 const register=document.getElementById('registerForm');
 if(login)login.addEventListener('submit',async event=>{
  event.preventDefault();
  show('Signing in…');
  try{
   const {error}=await db.auth.signInWithPassword({
    email:document.getElementById('email').value.trim(),
    password:document.getElementById('password').value
   });
   if(error){show(error.message);return;}
   location.href='../creator/index.html';
  }catch(error){show(error.message||'Unable to contact the sign-in service. Please try again.');}
 });
 if(register)register.addEventListener('submit',async event=>{
  event.preventDefault();
  show('Creating account…');
  try{
   const email=document.getElementById('email').value.trim();
   const password=document.getElementById('password').value;
   const emailRedirectTo=new URL('../index.html',window.location.href).toString();
   const {data,error}=await db.auth.signUp({
    email,password,options:{emailRedirectTo}
   });
   if(error){show(error.message);return;}
   show(data.session?'Account created. Continue to Owner Studio.':'Account created. Check your email to confirm, then log in.');
  }catch(error){show(error.message||'Unable to contact the registration service. Please try again.');}
 });
});