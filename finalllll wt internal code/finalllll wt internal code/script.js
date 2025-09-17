let fruits=[];
let cart=JSON.parse(localStorage.getItem('cart')||'{}');
let likes=JSON.parse(localStorage.getItem('likes')||'{}');
let ratings=JSON.parse(localStorage.getItem('ratings')||'{}');

document.addEventListener('DOMContentLoaded',()=>{
  if(document.getElementById('fruitsGrid')){
    fetch('fruits.json').then(r=>r.json()).then(data=>{
      fruits=data;
      // Check query param for filter
      const params=new URLSearchParams(window.location.search);
      const type=params.get('type')||'all';
      document.getElementById('filterSelect').value=type;
      applyFilters();
      renderCart();
      updateBadge();
      document.getElementById('sortSelect').addEventListener('change',applyFilters);
      document.getElementById('filterSelect').addEventListener('change',applyFilters);
    });
  } else {
    updateBadge();
  }
});

function applyFilters(){
  let sort=document.getElementById('sortSelect').value;
  let filter=document.getElementById('filterSelect').value;
  let list=[...fruits];
  if(filter!=='all'){list=list.filter(f=>f.type===filter);}
  if(sort==='name'){list.sort((a,b)=>a.name.localeCompare(b.name));}
  if(sort==='price-asc'){list.sort((a,b)=>a.price-b.price);}
  if(sort==='price-desc'){list.sort((a,b)=>b.price-a.price);}
  renderFruits(list);
}

function renderFruits(list){
  let grid=document.getElementById('fruitsGrid'); grid.innerHTML='';
  list.forEach(f=>{
    let likeCount=likes[f.id]||0;
    let currentRating=ratings[f.id]||0;
    let col=document.createElement('div'); col.className='col-md-4';
    col.innerHTML=`
      <div class='fruit-card'>
        <div class='flip-wrapper'>
          <div class='flipper'>
            <div class='flip-front'><img src='${f.image}' alt='${f.name}'></div>
            <div class='flip-back'><p>${f.description}</p></div>
          </div>
        </div>
        <div class='card-body'>
          <h5>${f.name}</h5>
          <p>${f.type.charAt(0).toUpperCase()+f.type.slice(1)}</p>
          <p>₹${f.price}</p>
          <button class='like-btn' data-id='${f.id}'>❤️ ${likeCount}</button>
          <div class='rating' data-id='${f.id}'>
            ${[1,2,3,4,5].map(i=>`<span data-star='${i}' class='${i<=currentRating?'active':''}'>★</span>`).join('')}
          </div>
          <button class='btn btn-success btn-sm add-btn' data-id='${f.id}'>Add to Cart</button>
        </div>
      </div>`;
    grid.appendChild(col);
  });
  grid.querySelectorAll('.like-btn').forEach(b=>b.onclick=()=>{
    let id=b.dataset.id;
    likes[id]=(likes[id]||0)+1;
    localStorage.setItem('likes',JSON.stringify(likes));
    applyFilters();
  });
  grid.querySelectorAll('.add-btn').forEach(b=>b.onclick=()=>{
    let id=b.dataset.id;
    cart[id]=(cart[id]||0)+1;
    localStorage.setItem('cart',JSON.stringify(cart));
    renderCart();
    updateBadge();
    showToast();
  });
  grid.querySelectorAll('.rating span').forEach(star=>{
    star.onclick=()=>{
      let id=star.parentNode.dataset.id;
      ratings[id]=Number(star.dataset.star);
      localStorage.setItem('ratings',JSON.stringify(ratings));
      applyFilters();
    };
  });
}

function renderCart(){
  let tbody=document.getElementById('cartTable'); if(!tbody) return; tbody.innerHTML='';
  let total=0;
  for(let id in cart){
    let qty=cart[id]; let f=fruits.find(x=>x.id==id); if(!f) continue;
    let cost=f.price; let sub=qty*cost; total+=sub;
    let tr=document.createElement('tr');
    tr.innerHTML=`
      <td><img src='${f.image}' width='40'> ${f.name}</td>
      <td>${qty}</td>
      <td>₹${cost}</td>
      <td>₹${sub}</td>
      <td><button class='btn btn-danger btn-sm' onclick='removeItem(${id})'>Remove</button></td>`;
    tbody.appendChild(tr);
  }
  document.getElementById('cartTotal').textContent=total;
  localStorage.setItem('cart',JSON.stringify(cart));
}

function removeItem(id){
  if(cart[id]>1){cart[id]--; } else {delete cart[id];}
  renderCart();updateBadge();
}

function updateBadge(){
  let count=0; for(let id in cart){count+=cart[id];}
  document.querySelectorAll('#cartBadge').forEach(b=>b.textContent=count);
}

function showToast(){
  let toastEl=document.getElementById('addToast');
  if(toastEl){let toast=new bootstrap.Toast(toastEl);toast.show();}
}
