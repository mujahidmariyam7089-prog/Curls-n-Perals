const CATS = { bracelets: 'Bracelets', earrings: 'Earrings', necklaces: 'Necklaces', sets: 'Sets' };
const SING = { Bracelets: 'Bracelet', Earrings: 'Earrings', Necklaces: 'Necklace', Sets: 'Set' };
const STAT = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
const SEED = [
  { id: 1, name: 'Classic Pearl Bracelet', cat: 'Bracelets', price: 1499, disc: 0, stock: 12, status: 'Active', sku: 'BR-001', desc: 'A single strand of lustrous freshwater pearls with a soft gold-tone clasp.', mat: 'Freshwater pearls, gold-plated clasp. 17 cm + 3 cm extender.', tags: 'classic,gift' },
  { id: 2, name: 'Blush Pearl Bracelet', cat: 'Bracelets', price: 1699, disc: 1399, stock: 3, status: 'Active', sku: 'BR-002', desc: 'Pearls with a hint of blush, strung by hand.', mat: 'Freshwater pearls, silk thread. 17 cm + 3 cm extender.', tags: 'blush,new' },
  { id: 3, name: 'Pearl Drop Earrings', cat: 'Earrings', price: 899, disc: 0, stock: 20, status: 'Active', sku: 'ER-001', desc: 'Single pearl drops on gold-plated hooks.', mat: 'Freshwater pearl, gold-plated hook.', tags: 'drop,everyday' },
  { id: 4, name: 'Pearl Stud Earrings', cat: 'Earrings', price: 599, disc: 0, stock: 0, status: 'Out of Stock', sku: 'ER-002', desc: 'Small round studs that go with everything.', mat: 'Freshwater pearl, sterling silver post.', tags: 'stud' },
  { id: 5, name: 'Single Strand Necklace', cat: 'Necklaces', price: 2199, disc: 0, stock: 8, status: 'Active', sku: 'NK-001', desc: 'A timeless 18 inch strand with a secure clasp.', mat: 'Freshwater pearls, gold-plated clasp. 18 in.', tags: 'classic' },
  { id: 6, name: 'Layered Pearl Necklace', cat: 'Necklaces', price: 2699, disc: 2299, stock: 5, status: 'Active', sku: 'NK-002', desc: 'Two strands of different lengths, worn together.', mat: 'Freshwater pearls, gold-plated clasp. 16 in + 20 in.', tags: 'layered' },
  { id: 7, name: 'Bridal Pearl Set', cat: 'Sets', price: 4999, disc: 4499, stock: 4, status: 'Active', sku: 'ST-001', desc: 'Matching earrings, bracelet and necklace for the big day.', mat: 'Freshwater pearls, gold-plated findings.', tags: 'bridal,set' },
  { id: 8, name: 'Everyday Pearl Set', cat: 'Sets', price: 3499, disc: 0, stock: 6, status: 'Active', sku: 'ST-002', desc: 'A lighter set for daily wear.', mat: 'Freshwater pearls, sterling silver findings.', tags: 'set,everyday' }];
const DEF = { ship: 99, express: 150, free: 2000, tax: 3, email: 'hello@curlsnpearls.in', phone: '+91 00000 00000', insta: '@curlsnpearls', loc: 'India' };
const SEEDC = [{ code: 'PEARL10', type: 'pct', val: 10, active: true }, { code: 'WELCOME200', type: 'flat', val: 200, active: true }];
const LS = { get(k, d) { try { const v = localStorage.getItem('cnp2-' + k); return v ? JSON.parse(v) : d } catch (e) { return d } }, set(k, v) { try { localStorage.setItem('cnp2-' + k, JSON.stringify(v)) } catch (e) { toast('Storage is full or blocked in this browser') } } };
let products = LS.get('products', SEED), cart = LS.get('cart', []), orders = LS.get('orders', []), coupons = LS.get('coupons', SEEDC), S = LS.get('settings', DEF), customers = LS.get('customers', []), msgs = LS.get('msgs', []), subs = LS.get('subs', []), me = LS.get('me', null), applied = LS.get('coupon', ''), seq = LS.get('seq', 1001);
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)], app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');
const unit = p => p.disc > 0 && p.disc < p.price ? p.disc : p.price;
const onSale = p => p.disc > 0 && p.disc < p.price;
const avail = p => p.status === 'Active' && p.stock > 0;
const priceHTML = p => onSale(p) ? `<b>${fmt(p.disc)}</b> <s style="color:var(--mute)">${fmt(p.price)}</s>` : `<b>${fmt(p.price)}</b>`;
const ph = t => `<div class="ph">${t}</div>`;
const imgHTML = p => p.img ? `<img class="pimg" src="${p.img}" alt="${esc(p.name)}" loading="lazy">` : ph(SING[p.cat] + ' image');
const saveAll = () => { LS.set('products', products); LS.set('cart', cart); LS.set('orders', orders); LS.set('coupons', coupons); LS.set('customers', customers); LS.set('msgs', msgs); LS.set('subs', subs); LS.set('settings', S); LS.set('me', me); LS.set('coupon', applied); LS.set('seq', seq); $('#cnt').textContent = cart.reduce((a, c) => a + c.q, 0) };
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200) };
const getP = id => products.find(p => p.id == id);
function add(id, q = 1, sz = 'Standard') { const p = getP(id); if (!p || !avail(p)) return toast('This piece is sold out'); const c = cart.find(x => x.id == id && x.sz === sz); const n = (c ? c.q : 0) + q; if (n > p.stock) { toast('Only ' + p.stock + ' in stock'); return } c ? c.q = n : cart.push({ id: +id, sz, q }); saveAll(); toast('Added to cart') }
function calc(extra = 0) { const lines = cart.map(c => { const p = getP(c.id); return p && { p, q: c.q, sz: c.sz, t: unit(p) * c.q } }).filter(Boolean); const sub = lines.reduce((a, l) => a + l.t, 0); const cp = coupons.find(c => c.code === applied && c.active); let disc = 0; if (cp && sub) disc = cp.type === 'pct' ? Math.round(sub * cp.val / 100) : Math.min(cp.val, sub); const net = sub - disc, ship = sub ? (net >= S.free ? 0 : S.ship) + extra : 0, tax = Math.round(net * S.tax / 100); return { lines, sub, disc, net, ship, tax, total: net + ship + tax, cp } }
function drawer(o) { $('#drawer').classList.toggle('open', o); $('#veil').classList.toggle('open', o); $('#menuBtn').setAttribute('aria-expanded', o) }
$('#menuBtn').onclick = () => drawer(true); $('#veil').onclick = () => drawer(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') drawer(false) });
function footer() { $('#foot').innerHTML = `<div><div class="brand">Curls n Pearls</div><p>Timeless pearl jewellery, made for you.<br>${esc(S.email)}<br>${esc(S.phone)}<br>${esc(S.loc)}</p></div><div><b>Shop</b><a href="#bracelets">Bracelets</a><a href="#earrings">Earrings</a><a href="#necklaces">Necklaces</a><a href="#sets">Sets</a></div><div><b>Help</b><a href="#contact">Contact &amp; FAQ</a><a href="#policy">Policies</a><a href="#account">My orders</a></div><div><b>Follow</b><a href="#contact">Instagram ${esc(S.insta)}</a><p>Cards · UPI · Net banking · Wallets</p></div>` }
/* ---------- views ---------- */
const V = {};
const card = p => `<article class="card"><a href="#product-${p.id}" style="text-decoration:none">${imgHTML(p)}<h3>${esc(p.name)}</h3></a><p>${p.cat === 'Sets' ? 'Earrings + bracelet + necklace<br>' : ''}${priceHTML(p)}${avail(p) && p.stock <= 3 ? ' · <small>Only ' + p.stock + ' left</small>' : ''}</p><div class="row"><button class="btn sm" data-act="add" data-id="${p.id}" ${avail(p) ? '' : 'disabled'}>${avail(p) ? 'Add to cart' : 'Sold out'}</button><a class="btn sm alt" href="#product-${p.id}">View details</a></div></article>`;
const live = () => products.filter(p => p.status !== 'Draft');
V.home = () => `<div class="stage" id="stage"><div class="hero"><div class="herobg" aria-hidden="true"><svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="w1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#f7e3e2"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="w2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#efe2cf"/><stop offset="1" stop-color="#fff"/></linearGradient><radialGradient id="b1"><stop offset="0" stop-color="#f4cdd3" stop-opacity=".7"/><stop offset="1" stop-color="#f4cdd3" stop-opacity="0"/></radialGradient><radialGradient id="b2"><stop offset="0" stop-color="#e8d3a8" stop-opacity=".6"/><stop offset="1" stop-color="#e8d3a8" stop-opacity="0"/></radialGradient></defs><circle cx="230" cy="190" r="260" fill="url(#b1)"/><circle cx="980" cy="560" r="300" fill="url(#b2)"/><circle cx="1010" cy="120" r="160" fill="url(#b1)"/><path d="M0 500C220 400 400 620 640 520S1000 400 1200 480V800H0Z" fill="url(#w1)" opacity=".75"/><path d="M0 610C260 540 430 700 700 630S1050 550 1200 610V800H0Z" fill="url(#w2)" opacity=".8"/><path d="M0 492C220 392 400 612 640 512S1000 392 1200 472" fill="none" stroke="#d9c08a" stroke-opacity=".55"/><path d="M0 602C260 532 430 692 700 622S1050 542 1200 602" fill="none" stroke="#d9c08a" stroke-opacity=".4"/></svg></div><div class="hand" id="hand"><img class="hand-base" id="handBase" alt="" aria-hidden="true" src="images/hero-hand.webp"><img class="hand-full" id="handFull" alt="Hand holding pearl jewellery" src="images/hero-full.webp"></div>
<div class="wrap" style="width:100%"><div class="copy"><h1>Curls n Pearls</h1><p style="font-size:1.2rem;font-family:'Cormorant Garamond',serif">Timeless elegance, made for you.</p><a class="btn" href="#shop">Explore collection</a></div></div></div>
<section style="padding-top:20px"><div class="wrap"><h2 style="text-align:center">Featured collections</h2><div class="tiles">${Object.entries(CATS).map(([k, v]) => { const p = live().find(x => x.cat === v && x.img); return `<a class="tile" href="#${k}">${p ? `<img class="pimg" src="${p.img}" alt="">` : ph(SING[v] + ' image')}<h3>${v}</h3></a>` }).join('')}</div></div></section></div>
<section><div class="wrap cols"><div>${ph('Brand photo')}</div><div style="align-self:center"><h2>Made softly, worn for years</h2><p>Every piece is strung by hand from freshwater pearls and finished with gold-plated or sterling silver fittings.</p><a class="btn alt" href="#about">Our story</a></div></div></section>
<section style="background:var(--bg2)"><div class="wrap"><h2>New arrivals</h2><div class="grid">${live().filter(avail).slice(-4).map(card).join('')}</div></div></section>
<section><div class="wrap"><h2 style="text-align:center">What customers say</h2><div class="tiles" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${[['Priya', 'The pearls feel just like the photos. Lovely gift.'], ['Ananya', 'Arrived beautifully packed.'], ['Meera', 'I wear the bracelet every day.']].map(t => `<div class="panel" style="text-align:center">“${t[1]}”<br><small>${t[0]} · sample review</small></div>`).join('')}</div></div></section>
<section style="background:var(--bg2)"><div class="wrap"><h2>Instagram</h2><p>Follow ${esc(S.insta)}</p><div class="tiles">${[1, 2, 3, 4].map(() => ph('Instagram photo')).join('')}</div></div></section>
<section><div class="wrap" style="max-width:520px;text-align:center"><h2>Join the list</h2><p>New pieces and offers, a few times a year.</p><form data-form="news" class="row"><input name="email" type="email" required placeholder="Email address" aria-label="Email address" style="flex:1"><button class="btn">Subscribe</button></form></div></section>`;
let F = { q: '', cat: '', av: '', sort: '', max: '' };
function listing(title, cat) { F = { q: '', cat, av: '', sort: '', max: '' }; return `<section><div class="wrap"><h1 style="font-size:clamp(2rem,5vw,3rem)">${title}</h1><div class="filters"><input data-f="q" type="search" placeholder="Search jewellery" aria-label="Search"><select data-f="cat" aria-label="Category"><option value="">All categories</option>${Object.values(CATS).map(c => `<option ${c === cat ? 'selected' : ''}>${c}</option>`).join('')}</select><select data-f="av" aria-label="Availability"><option value="">Any availability</option><option value="in">In stock</option><option value="out">Sold out</option></select><select data-f="max" aria-label="Price"><option value="">Any price</option><option value="1000">Up to ₹1,000</option><option value="2000">Up to ₹2,000</option><option value="3000">Up to ₹3,000</option></select><select data-f="sort" aria-label="Sort"><option value="">Featured</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div><div class="grid" id="lg"></div></div></section>` }
function filt() { let r = live().filter(p => (!F.cat || p.cat === F.cat) && (!F.q || (p.name + ' ' + p.tags).toLowerCase().includes(F.q.toLowerCase())) && (!F.av || (F.av === 'in') === avail(p)) && (!F.max || unit(p) <= +F.max)); if (F.sort) r.sort((a, b) => F.sort === 'lo' ? unit(a) - unit(b) : unit(b) - unit(a)); $('#lg').innerHTML = r.length ? r.map(card).join('') : '<p>No pieces match. Clear the search or pick another category.</p>' }
V.shop = () => listing('Shop', ''); Object.keys(CATS).forEach(k => V[k] = () => listing(CATS[k], CATS[k]));
V.product = id => {
  const p = getP(id); if (!p || p.status === 'Draft') return V.shop(); const rel = live().filter(x => x.id !== p.id).sort((a, b) => (b.cat === p.cat) - (a.cat === p.cat)).slice(0, 4);
  return `<section><div class="wrap"><div class="cols"><div>${imgHTML(p)}</div><div><p><a href="#${p.cat.toLowerCase()}">${p.cat}</a> · SKU ${esc(p.sku)}</p><h1 style="font-size:clamp(2rem,5vw,3rem)">${esc(p.name)}</h1><p style="font-size:1.4rem">${priceHTML(p)}</p><p>${esc(p.desc)}</p>
${p.cat === 'Sets' ? `<div class="panel"><b>This set includes</b><div class="line"><span>Earrings</span><span>1 pair</span></div><div class="line"><span>Bracelet</span><span>1</span></div><div class="line" style="border:0"><span>Necklace</span><span>1</span></div></div>` : ''}
<h3 style="margin-top:20px">Materials &amp; details</h3><p>${esc(p.mat)}</p>
<label for="sz">${p.cat === 'Bracelets' ? 'Size' : 'Option'}</label><select id="sz">${p.cat === 'Bracelets' ? '<option>Standard</option><option>Small (16 cm)</option><option>Large (19 cm)</option>' : '<option>Standard</option>'}</select><label for="q">Quantity</label><input id="q" type="number" min="1" max="${Math.max(1, p.stock)}" value="1" style="width:100px">
<div class="row" style="margin-top:18px"><button class="btn" data-act="add" data-id="${p.id}" data-qty ${avail(p) ? '' : 'disabled'}>${avail(p) ? 'Add to cart' : 'Sold out'}</button><button class="btn alt" data-act="buy" data-id="${p.id}" ${avail(p) ? '' : 'disabled'}>Buy now</button></div><p style="color:var(--mute);margin-top:14px">${avail(p) ? (p.stock <= 3 ? 'Only ' + p.stock + ' left.' : 'In stock.') : 'Currently sold out.'}</p></div></div>
<h2 style="margin-top:50px">You may also like</h2><div class="grid">${rel.map(card).join('')}</div><h3 style="margin-top:40px">Reviews</h3><p class="note">Reviews from verified buyers will appear here.</p></div></section>`
};
V.cart = () => {
  const c = calc(); return `<section><div class="wrap"><h1 style="font-size:2.4rem">Your cart</h1>${c.lines.length ? `<div class="cols w"><div>${c.lines.map(l => `<div class="ci">${l.p.img ? `<img class="pimg" style="aspect-ratio:1" src="${l.p.img}" alt="">` : ph('Image')}<div><a href="#product-${l.p.id}"><b>${esc(l.p.name)}</b></a><br><small>${l.sz} · ${fmt(unit(l.p))} each</small><br><span class="qty"><button data-act="dec" data-id="${l.p.id}" data-sz="${esc(l.sz)}" aria-label="Decrease">−</button><span>${l.q}</span><button data-act="inc" data-id="${l.p.id}" data-sz="${esc(l.sz)}" aria-label="Increase">+</button></span></div><div style="text-align:right"><b>${fmt(l.t)}</b><br><button class="btn sm alt" data-act="rm" data-id="${l.p.id}" data-sz="${esc(l.sz)}">Remove</button></div></div>`).join('')}</div>
<div class="panel">${totals(c)}<form data-form="coupon"><label for="cp">Coupon code</label><div class="row"><input id="cp" name="code" style="flex:1" placeholder="Try PEARL10" value="${c.cp ? esc(applied) : ''}"><button class="btn sm alt">${c.cp ? 'Change' : 'Apply'}</button></div></form><p><a class="btn" href="#checkout" style="width:100%;text-align:center">Proceed to checkout</a></p></div></div>` : `<p>Your cart is empty. <a href="#shop">Browse the shop</a> to add something.</p>`}</div></section>`
};
const totals = c => `<div class="line"><span>Subtotal</span><span>${fmt(c.sub)}</span></div>${c.disc ? `<div class="line"><span>Discount (${esc(c.cp.code)})</span><span>−${fmt(c.disc)}</span></div>` : ''}<div class="line"><span>Shipping</span><span>${c.ship ? fmt(c.ship) : 'Free'}</span></div><div class="line"><span>GST (${S.tax}%)</span><span>${fmt(c.tax)}</span></div><div class="line"><b>Total</b><b>${fmt(c.total)}</b></div>`;
let busy = false;
V.checkout = () => { if (!cart.length) return V.cart(); const c = calc(); return `<section><div class="wrap"><h1 style="font-size:2.4rem">Checkout</h1><div class="cols w"><form data-form="order" class="panel"><label>Full name</label><input name="name" required value="${esc(me?.name || '')}"><label>Email</label><input name="email" type="email" required value="${esc(me?.email || '')}"><label>Phone</label><input name="phone" type="tel" pattern="[0-9]{10}" maxlength="10" required placeholder="10-digit mobile number"><label>Shipping address</label><textarea name="addr" rows="3" required></textarea><div class="cols"><div><label>City</label><input name="city" required></div><div><label>State</label><input name="state" required></div></div><label>PIN code</label><input name="pin" pattern="[0-9]{6}" maxlength="6" required placeholder="6 digits"><label>Shipping method</label><select name="ship" data-ch="ship"><option value="0">Standard (${c.ship && c.net < S.free ? fmt(S.ship) : 'Free'})</option><option value="1">Express (+${fmt(S.express)})</option></select><label>Payment method</label><select name="pay"><option>UPI</option><option>Debit / Credit card</option><option>Net banking</option><option>Wallet</option><option>Cash on delivery</option></select><label>Order notes</label><textarea name="notes" rows="2"></textarea><p class="note" style="margin-top:16px">Demo payment: no money is charged. A live Razorpay or Cashfree hosted checkout replaces this step once keys are connected.</p><button class="btn" id="pay" style="margin-top:12px">Place order · <span id="tot">${fmt(c.total)}</span></button></form><div class="panel"><h3>Order summary</h3>${c.lines.map(l => `<div class="line"><span>${esc(l.p.name)} × ${l.q}</span><span>${fmt(l.t)}</span></div>`).join('')}<div id="sum">${totals(c)}</div></div></div></div></section>` };
V.order = id => { const o = orders.find(x => x.id === id); if (!o) return V.account(); return `<section><div class="wrap" style="max-width:640px"><h1>Thank you</h1><div class="panel"><div class="line"><span>Order ID</span><b>${o.id}</b></div><div class="line"><span>Order status</span><span>${o.status}</span></div><div class="line"><span>Payment</span><span>${o.pay} · ${o.payStatus}${o.payStatus === 'Paid' ? ' (demo)' : ''}</span></div><div class="line"><span>Estimated delivery</span><span>${o.eta}</span></div>${o.items.map(i => `<div class="line"><span>${esc(i.name)} × ${i.q}</span><span>${fmt(i.price * i.q)}</span></div>`).join('')}<div class="line"><b>Total</b><b>${fmt(o.total)}</b></div><p>Ship to: ${esc(o.cust.name)}, ${esc(o.cust.addr)}, ${esc(o.cust.city)}, ${esc(o.cust.state)} ${esc(o.cust.pin)}</p></div><p class="note" style="margin-top:16px">Email confirmations send once the store is connected to an email service. Track this order any time under My orders.</p><p><a class="btn" href="#shop">Keep shopping</a></p></div></section>` };
const ordList = l => l.length ? l.map(o => `<a class="panel" href="#order-${o.id}" style="display:block;text-decoration:none;margin-bottom:10px"><div class="line" style="border:0"><b>${o.id}</b><span>${o.status}</span></div><small>${new Date(o.date).toLocaleDateString('en-IN')} · ${o.items.length} item(s) · ${fmt(o.total)} · ${o.payStatus}</small></a>`).join('') : '<p>No orders yet.</p>';
V.account = () => me ? `<section><div class="wrap" style="max-width:640px"><h1 style="font-size:2.4rem">My orders</h1><p>Signed in as ${esc(me.name)} (${esc(me.email)}). <button class="btn sm alt" data-act="logout">Log out</button></p>${ordList(orders.filter(o => o.cust.email.toLowerCase() === me.email.toLowerCase()))}</div></section>` : `<section><div class="wrap" style="max-width:460px"><h1 style="font-size:2.4rem">Login / Register</h1><form data-form="login" class="panel"><label>Name</label><input name="name" required><label>Email</label><input name="email" type="email" required><p><button class="btn">Continue</button></p><p class="note">Passwords and Google login need the live backend. For now your email opens your order history on this device.</p></form></div></section>`;
V.about = () => `<section><div class="wrap cols"><div>${ph('Founder / brand photo')}</div><div><h1 style="font-size:2.6rem">Our story</h1><p>Curls n Pearls began with a simple idea: pearl jewellery should feel soft, personal and made for you.</p><h3>Mission &amp; values</h3><p>Honest materials, careful hands, and pieces you will reach for every day.</p></div></div></section>`;
V.contact = () => `<section><div class="wrap cols"><form data-form="msg" class="panel"><h1 style="font-size:2.2rem">Contact us</h1><label>Name</label><input name="name" required><label>Email</label><input name="email" type="email" required><label>Message</label><textarea name="msg" rows="4" required></textarea><p><button class="btn">Send message</button></p></form><div><h3>Details</h3><p>Email: ${esc(S.email)}<br>Phone / WhatsApp: ${esc(S.phone)}<br>Instagram: ${esc(S.insta)}<br>Location: ${esc(S.loc)}</p><h3>FAQ</h3><details><summary>How long does delivery take?</summary><p>Standard delivery takes 5–7 days, express 2–3 days.</p></details><details><summary>Can I return a piece?</summary><p>Yes, within 7 days of delivery if unworn and in original packaging.</p></details><details><summary>How should I care for pearls?</summary><p>Wear them last, wipe with a soft cloth, store apart from other jewellery.</p></details></div></div></section>`;
V.policy = () => `<section><div class="wrap" style="max-width:700px"><h1 style="font-size:2.4rem">Policies</h1>${[['Privacy Policy', 'We collect only what we need to fulfil your order and never store card details; payments are handled by the payment gateway.'], ['Terms &amp; Conditions', 'Prices are in INR and include GST where shown. We may cancel orders that cannot be fulfilled.'], ['Return / Refund Policy', 'Returns within 7 days of delivery for unworn items. Refunds go to the original payment method.'], ['Shipping Policy', 'Standard shipping ' + fmt(S.ship) + ', free above ' + fmt(S.free) + '. Express ' + fmt(S.express) + ' extra.'], ['Payment Security Policy', 'Payments use PCI-compliant hosted checkout. We never see or store card numbers, CVV or UPI PINs.']].map(t => `<h3>${t[0]}</h3><p>${t[1]}</p>`).join('')}</div></section>`;
/* ---------- admin ---------- */
let editing = null, formImg = '';
const tabs = [['admin', 'Dashboard'], ['admin-products', 'Products'], ['admin-orders', 'Orders'], ['admin-customers', 'Customers'], ['admin-coupons', 'Coupons'], ['admin-settings', 'Settings']];
const bar = (l, v, m) => `<div class="line" style="border:0;align-items:center"><span style="min-width:90px">${l}</span><div style="flex:1;background:var(--bg2);border-radius:6px;height:12px"><div style="width:${m ? Math.round(v / m * 100) : 0}%;background:var(--gold);height:12px;border-radius:6px"></div></div><span>${typeof v === 'number' && l.startsWith('₹') ? '' : ''}${v}</span></div>`;
V.admin = t => {
  const rev = orders.filter(o => o.payStatus === 'Paid').reduce((a, o) => a + o.total, 0), low = products.filter(p => p.stock <= 3 && p.status !== 'Draft');
  const nav = `<div class="row chips" style="margin:14px 0">${tabs.map(x => `<a class="btn sm ${x[0] === t ? '' : 'alt'}" href="#${x[0]}">${x[1]}</a>`).join('')}</div>`;
  let body = '';
  if (t === 'admin') {
    const byS = STAT.map(s => [s, orders.filter(o => o.status === s).length]), byC = Object.values(CATS).map(c => [c, orders.reduce((a, o) => a + o.items.filter(i => i.cat === c).reduce((b, i) => b + i.price * i.q, 0), 0)]);
    body = `<div class="stats">${[['Revenue (paid)', fmt(rev)], ['Orders', orders.length], ['Low stock', low.length], ['Customers', new Set(orders.map(o => o.cust.email.toLowerCase()).concat(customers.map(c => c.email.toLowerCase()))).size]].map(s => `<div class="panel">${s[0]}<b>${s[1]}</b></div>`).join('')}</div><div class="cols" style="margin-top:20px"><div class="panel"><h3>Orders by status</h3>${byS.map(x => bar(x[0], x[1], Math.max(1, ...byS.map(y => y[1])))).join('')}</div><div class="panel"><h3>Sales by category (₹)</h3>${byC.map(x => bar(x[0], x[1], Math.max(1, ...byC.map(y => y[1])))).join('')}</div></div><div class="cols" style="margin-top:20px"><div class="panel"><h3>Low-stock alerts</h3>${low.map(p => `<div class="line"><span>${esc(p.name)}</span><span>${p.stock} left</span></div>`).join('') || '<p>All stocked.</p>'}</div><div class="panel"><h3>Recent orders</h3>${orders.slice(-5).reverse().map(o => `<div class="line"><span>${o.id}</span><span>${fmt(o.total)} · ${o.status}</span></div>`).join('') || '<p>No orders yet.</p>'}</div></div><p style="color:var(--mute)">Newsletter subscribers: ${subs.length} · Messages: ${msgs.length}</p>`
  }
  if (t === 'admin-products') {
    const p = editing === 'new' ? { name: '', cat: 'Bracelets', price: '', disc: '', stock: '', status: 'Active', sku: '', desc: '', mat: '', tags: '' } : products.find(x => x.id == editing);
    body = `<div class="row" style="margin-bottom:12px"><button class="btn sm" data-act="pnew">Add product</button></div>${p ? `<form data-form="product" class="panel" style="margin-bottom:20px"><h3>${editing === 'new' ? 'New product' : 'Edit product'}</h3><div class="cols"><div><label>Name</label><input name="name" required value="${esc(p.name)}"><label>Category</label><select name="cat">${Object.values(CATS).map(c => `<option ${c === p.cat ? 'selected' : ''}>${c}</option>`).join('')}</select><label>Price (₹)</label><input name="price" type="number" min="1" required value="${p.price}"><label>Discounted price (₹, optional)</label><input name="disc" type="number" min="0" value="${p.disc || ''}"><label>Stock quantity</label><input name="stock" type="number" min="0" required value="${p.stock}"></div><div><label>Status</label><select name="status">${['Active', 'Draft', 'Out of Stock'].map(s => `<option ${s === p.status ? 'selected' : ''}>${s}</option>`).join('')}</select><label>SKU</label><input name="sku" value="${esc(p.sku)}"><label>Tags (comma separated)</label><input name="tags" value="${esc(p.tags)}"><label>Description</label><textarea name="desc" rows="2">${esc(p.desc)}</textarea><label>Materials / details</label><textarea name="mat" rows="2">${esc(p.mat)}</textarea></div></div><label>Product image</label><input type="file" accept="image/*" data-ch="img"><div id="prev">${(formImg || p.img) ? `<img src="${formImg || p.img}" style="width:90px;border-radius:8px;margin-top:8px" alt="">` : ''}</div><p class="row"><button class="btn">Save product</button><button type="button" class="btn alt" data-act="pcancel">Cancel</button></p></form>` : ''}<div class="tw panel"><table><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>${products.map(p => `<tr><td>${esc(p.sku)}</td><td>${esc(p.name)}</td><td>${p.cat}</td><td>${fmt(unit(p))}</td><td>${p.stock}</td><td>${p.status}</td><td><button class="btn sm alt" data-act="pedit" data-id="${p.id}">Edit</button> <button class="btn sm alt" data-act="pdel" data-id="${p.id}">Delete</button></td></tr>`).join('')}</table></div>`
  }
  if (t === 'admin-orders') body = orders.length ? [...orders].reverse().map(o => `<div class="panel" style="margin-bottom:12px"><div class="line" style="border:0"><b>${o.id}</b><span>${new Date(o.date).toLocaleString('en-IN')}</span></div><p style="margin:0">${esc(o.cust.name)} · ${esc(o.cust.email)} · ${esc(o.cust.phone)}<br>${esc(o.cust.addr)}, ${esc(o.cust.city)}, ${esc(o.cust.state)} ${esc(o.cust.pin)}<br>${o.items.map(i => esc(i.name) + ' × ' + i.q).join(', ')}<br>${fmt(o.total)} · ${o.pay} · Payment: ${o.payStatus}</p><label>Order status</label><select data-ch="ostat" data-id="${o.id}">${STAT.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>`).join('') : '<p>No orders yet. Place a test order from the shop and it will appear here.</p>';
  if (t === 'admin-customers') { const m = new Map(); customers.forEach(c => m.set(c.email.toLowerCase(), { ...c, n: 0 })); orders.forEach(o => { const k = o.cust.email.toLowerCase(), c = m.get(k) || { name: o.cust.name, email: o.cust.email, n: 0 }; c.n++; m.set(k, c) }); body = `<div class="tw panel"><table><tr><th>Name</th><th>Email</th><th>Orders</th></tr>${[...m.values()].map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.email)}</td><td>${c.n}</td></tr>`).join('') || '<tr><td colspan=3>No customers yet.</td></tr>'}</table></div>` }
  if (t === 'admin-coupons') body = `<form data-form="cpn" class="panel row" style="margin-bottom:16px;align-items:end"><div><label>Code</label><input name="code" required></div><div><label>Type</label><select name="type"><option value="pct">Percent off</option><option value="flat">Flat ₹ off</option></select></div><div><label>Value</label><input name="val" type="number" min="1" required></div><button class="btn sm">Add coupon</button></form><div class="panel">${coupons.map(c => `<div class="line"><span>${esc(c.code)} · ${c.type === 'pct' ? c.val + '%' : fmt(c.val)} off</span><span><button class="btn sm alt" data-act="ctog" data-code="${esc(c.code)}">${c.active ? 'Disable' : 'Enable'}</button> <button class="btn sm alt" data-act="cdel" data-code="${esc(c.code)}">Delete</button></span></div>`).join('') || '<p>No coupons.</p>'}</div>`;
  if (t === 'admin-settings') body = `<form data-form="settings" class="panel"><div class="cols"><div><label>Standard shipping (₹)</label><input name="ship" type="number" min="0" value="${S.ship}"><label>Express extra (₹)</label><input name="express" type="number" min="0" value="${S.express}"><label>Free shipping above (₹)</label><input name="free" type="number" min="0" value="${S.free}"><label>GST (%)</label><input name="tax" type="number" min="0" step="0.1" value="${S.tax}"></div><div><label>Business email</label><input name="email" value="${esc(S.email)}"><label>Phone / WhatsApp</label><input name="phone" value="${esc(S.phone)}"><label>Instagram</label><input name="insta" value="${esc(S.insta)}"><label>Location</label><input name="loc" value="${esc(S.loc)}"></div></div><p class="row"><button class="btn">Save settings</button><button type="button" class="btn alt" data-act="reset">Reset demo data</button></p></form>`;
  return `<section><div class="wrap"><h1 style="font-size:2.4rem">Admin dashboard</h1><p class="note">Works on this device only: data is saved in this browser. Real admin login with 2FA, a shared database and image storage need the backend.</p>${nav}${body}</div></section>`
};
/* ---------- events ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, id = b.dataset.id, sz = b.dataset.sz;
  if (a === 'add') { add(id, b.hasAttribute('data-qty') ? Math.max(1, +$('#q').value || 1) : 1, b.hasAttribute('data-qty') ? $('#sz').value : 'Standard') }
  else if (a === 'buy') { const n = cart.length; add(id, Math.max(1, +$('#q').value || 1), $('#sz').value); if (cart.length >= n) location.hash = '#checkout' }
  else if (a === 'inc' || a === 'dec') { const c = cart.find(x => x.id == id && x.sz === sz), p = getP(id); if (a === 'inc') { if (c.q >= p.stock) return toast('Only ' + p.stock + ' in stock'); c.q++ } else c.q = Math.max(1, c.q - 1); saveAll(); render(1) }
  else if (a === 'rm') { cart = cart.filter(x => !(x.id == id && x.sz === sz)); saveAll(); render(1) }
  else if (a === 'logout') { me = null; saveAll(); render() }
  else if (a === 'pnew') { editing = 'new'; formImg = ''; render(1) }
  else if (a === 'pedit') { editing = +id; formImg = ''; render(1) }
  else if (a === 'pcancel') { editing = null; formImg = ''; render(1) }
  else if (a === 'pdel') { if (confirm('Delete this product?')) { products = products.filter(p => p.id != id); cart = cart.filter(c => c.id != id); saveAll(); render(1) } }
  else if (a === 'ctog') { const c = coupons.find(x => x.code === b.dataset.code); c.active = !c.active; saveAll(); render(1) }
  else if (a === 'cdel') { coupons = coupons.filter(x => x.code !== b.dataset.code); saveAll(); render(1) }
  else if (a === 'reset') { if (confirm('Reset products, orders, coupons and settings on this device?')) { ['products', 'cart', 'orders', 'coupons', 'customers', 'msgs', 'subs', 'settings', 'me', 'coupon', 'seq'].forEach(k => { try { localStorage.removeItem('cnp2-' + k) } catch (e) { } }); location.reload() } }
});
const FORMS = {
  news: (f, d) => { subs.push(d.get('email')); saveAll(); f.reset(); toast('Subscribed. Thank you!') },
  msg: (f, d) => { msgs.push({ name: d.get('name'), email: d.get('email'), msg: d.get('msg'), date: new Date().toISOString() }); saveAll(); f.reset(); toast('Message sent. We will reply by email.') },
  login: (f, d) => { me = { name: d.get('name').trim(), email: d.get('email').trim() }; if (!customers.some(c => c.email.toLowerCase() === me.email.toLowerCase())) customers.push(me); saveAll(); render() },
  coupon: (f, d) => { const code = d.get('code').trim().toUpperCase(), c = coupons.find(x => x.code === code && x.active); if (!c) return toast('That code is not valid'); applied = code; saveAll(); toast('Coupon applied'); render(1) },
  cpn: (f, d) => { const code = d.get('code').trim().toUpperCase(); if (coupons.some(c => c.code === code)) return toast('Code already exists'); coupons.push({ code, type: d.get('type'), val: +d.get('val'), active: true }); saveAll(); render(1) },
  settings: (f, d) => { ['ship', 'express', 'free', 'tax'].forEach(k => S[k] = +d.get(k));['email', 'phone', 'insta', 'loc'].forEach(k => S[k] = d.get(k)); saveAll(); footer(); toast('Settings saved') },
  product: (f, d) => {
    const o = { name: d.get('name').trim(), cat: d.get('cat'), price: +d.get('price'), disc: +d.get('disc') || 0, stock: +d.get('stock'), status: d.get('status'), sku: d.get('sku'), tags: d.get('tags'), desc: d.get('desc'), mat: d.get('mat') };
    if (editing === 'new') products.push({ id: Math.max(0, ...products.map(p => p.id)) + 1, ...o, img: formImg || '' }); else { const p = getP(editing); Object.assign(p, o); if (formImg) p.img = formImg }
    editing = null; formImg = ''; saveAll(); toast('Product saved'); render(1)
  },
  order: (f, d) => {
    if (busy) return; const ex = d.get('ship') === '1' ? S.express : 0, c = calc(ex);
    for (const l of c.lines) if (l.q > l.p.stock || !avail(l.p)) return toast(l.p.name + ' is no longer available in that quantity');
    busy = true; const btn = $('#pay'); btn.disabled = true; btn.textContent = 'Processing payment…';
    setTimeout(() => {
      const cod = d.get('pay') === 'Cash on delivery', id = 'CNP-' + (seq++);
      const o = { id, date: new Date().toISOString(), items: c.lines.map(l => ({ id: l.p.id, name: l.p.name, cat: l.p.cat, sz: l.sz, q: l.q, price: unit(l.p) })), cust: { name: d.get('name'), email: d.get('email'), phone: d.get('phone'), addr: d.get('addr'), city: d.get('city'), state: d.get('state'), pin: d.get('pin'), notes: d.get('notes') }, pay: d.get('pay'), payStatus: cod ? 'Pending' : 'Paid', status: cod ? 'Pending' : 'Confirmed', sub: c.sub, disc: c.disc, coupon: c.cp ? c.cp.code : '', shipCost: c.ship, tax: c.tax, total: c.total, eta: ex ? '2–3 days' : '5–7 days', restocked: false };
      c.lines.forEach(l => l.p.stock -= l.q); orders.push(o); cart = []; applied = ''; me = me || { name: o.cust.name, email: o.cust.email }; if (!customers.some(x => x.email.toLowerCase() === me.email.toLowerCase())) customers.push(me); saveAll(); busy = false; location.hash = '#order-' + id
    }, 900)
  }
};
document.addEventListener('submit', e => { const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); FORMS[f.dataset.form]?.(f, new FormData(f)) });
document.addEventListener('input', e => { const t = e.target; if (t.dataset.f) { F[t.dataset.f] = t.value; filt() } });
document.addEventListener('change', e => {
  const t = e.target, k = t.dataset.ch; if (t.dataset.f) { F[t.dataset.f] = t.value; filt() }
  if (k === 'ship') { const c = calc(t.value === '1' ? S.express : 0); $('#sum').innerHTML = totals(c); $('#tot').textContent = fmt(c.total) }
  if (k === 'ostat') { const o = orders.find(x => x.id === t.dataset.id); o.status = t.value; if (t.value === 'Refunded') o.payStatus = 'Refunded'; if ((t.value === 'Cancelled' || t.value === 'Refunded') && !o.restocked) { o.items.forEach(i => { const p = getP(i.id); if (p) p.stock += i.q }); o.restocked = true } saveAll(); toast('Order updated') }
  if (k === 'img' && t.files[0]) { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 640 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = im.width * s; cv.height = im.height * s; cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); formImg = cv.toDataURL('image/jpeg', .8); $('#prev').innerHTML = `<img src="${formImg}" style="width:90px;border-radius:8px;margin-top:8px" alt="">` }; im.src = r.result }; r.readAsDataURL(t.files[0]) }
});
/* ---------- router ---------- */
let cleanup = null;
function render(keep) {
  drawer(false); cleanup && cleanup(); cleanup = null; const y = scrollY; let h = (location.hash || '#home').slice(1), arg;
  if (h.startsWith('product-')) { arg = h.slice(8); h = 'product' } else if (h.startsWith('order-')) { arg = h.slice(6); h = 'order' } else if (h.startsWith('admin')) { arg = h; h = 'admin' }
  if (!V[h]) h = 'home'; app.innerHTML = V[h](arg); keep ? scrollTo(0, y) : scrollTo(0, 0); saveAll(); footer();
  if (h === 'home') hero(); if ($('#lg')) filt()
}
function hero() {
  const stage = $('#stage'), hand = $('#hand'), handFull = $('#handFull');
  if (!hand) return;

  // Exact coordinates of the 19 pearls on the hanging loop
  const PTS = [
    [558, 350], [558, 381], [559, 412], [562, 443], [568, 474],
    [577, 507], [590, 540], [601, 567], [620, 589],
    [643, 604], // Apex bottom pearl
    [669, 597], [689, 573], [698, 540], [702, 507], [703, 474],
    [702, 440], [701, 407], [700, 374], [695, 345]
  ];

  const pearls = [];

  PTS.forEach(function(pt, i) {
    const px = pt[0], py = pt[1];
    const el = document.createElement('div');
    el.className = 'pearl';
    el.setAttribute('aria-hidden', 'true');
    hand.appendChild(el);

    // Natural falling cascade:
    // All pearls start flowing downward smoothly as soon as scrolling begins,
    // with subtle staggered acceleration from bottom to top
    const distFromApex = Math.abs(i - 9);
    // Subtle lead time: apex leads slightly, upper pearls follow in a continuous stream
    const lead = (1 - distFromApex / 9) * 0.04;
    // Micro-flutter horizontally (very subtle, +/- 6px max)
    const sway = ((i * 13) % 9 - 4) * 1.5;
    // Subtle rotation
    const rot = (i % 2 === 0 ? 1 : -1) * (30 + (i * 9) % 25);

    pearls.push({ el: el, px: px, py: py, lead: lead, sway: sway, rot: rot });
  });

  let heroH = 0, k = 1, dia = 28;

  function measure() {
    const W = hand.offsetWidth;
    k = W / 1024;
    dia = Math.max(14, 29 * k);
    heroH = stage.querySelector('.hero').offsetHeight || 700;
    pearls.forEach(function(p) {
      p.sx = p.px * k - dia / 2;
      p.sy = p.py * k - dia / 2;
      p.el.style.width = dia + 'px';
      p.el.style.height = dia + 'px';
    });
    draw();
  }

  function draw() {
    const y = scrollY;
    // Normalized scroll progress across hero
    const p0 = Math.min(1, Math.max(0, y / (heroH * 0.65)));

    // At rest (scrollY near 0): show the 100% original full photo with zero seams
    if (p0 < 0.005) {
      if (handFull) handFull.style.opacity = '1';
      pearls.forEach(function(p) {
        p.el.style.opacity = '0';
        p.el.style.transform = 'translate3d(' + p.sx + 'px,' + p.sy + 'px,0)';
      });
      return;
    }

    // Active scroll: instant clean transition as individual pearls pour downward
    if (handFull) {
      handFull.style.opacity = p0 < 0.02 ? String(Math.max(0, 1 - (p0 - 0.005) / 0.015)) : '0';
    }

    // Gravity waterfall: pearls slide down and plunge straight off the hand
    const fallDist = heroH * 1.4;
    pearls.forEach(function(p) {
      // Progress for this pearl factoring in its natural lead
      const t = Math.min(1, Math.max(0, (p0 + p.lead) / (1 + p.lead)));
      // Gravitational acceleration (smooth power curve)
      const fallY = Math.pow(t, 1.75) * fallDist;
      // Natural subtle drift sway
      const driftX = p.sway * Math.sin(t * Math.PI) * k;
      // Gentle tumble rotation
      const curRot = p.rot * t;
      // Fade out smoothly in the lower half of the fall
      const op = t > 0.45 ? Math.max(0, 1 - (t - 0.45) / 0.55) : 1;

      p.el.style.opacity = op;
      p.el.style.transform = 'translate3d(' + (p.sx + driftX) + 'px,' + (p.sy + fallY) + 'px,0) rotate(' + curRot + 'deg)';
    });
  }

  let tick = false;
  const on = function() {
    if (!tick) {
      tick = true;
      requestAnimationFrame(function() {
        draw();
        tick = false;
      });
    }
  };

  addEventListener('scroll', on, { passive: true });
  addEventListener('resize', measure);
  measure();
  requestAnimationFrame(function() {
    document.body.classList.add('loaded');
  });

  cleanup = function() {
    removeEventListener('scroll', on);
    removeEventListener('resize', measure);
    document.body.classList.remove('loaded');
  };
}
addEventListener('hashchange', () => render()); render();