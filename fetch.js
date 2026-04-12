fetch('https://ibb.co/Hfy1SmqR')
.then(r => r.text())
.then(t => {
  const match = t.match(/<meta property="og:image" content="([^"]+)"/);
  if (match) console.log(match[1]);
});
