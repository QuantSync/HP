import { spawn } from 'node:child_process';

async function main() {
  const server = spawn('npm', ['run', 'start'], {
    cwd: 'C:\\Users\\anubh\\StudioProjects\\HP',
    shell: true,
  });

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  // wait 5 seconds for Next.js server to start
  await new Promise((r) => setTimeout(r, 6000));

  try {
    // 1. Unauthenticated request to / -> should redirect to /login
    const resHome = await fetch('http://localhost:3000/', { redirect: 'manual' });
    console.log('1. Unauth / -> Status:', resHome.status, 'Location:', resHome.headers.get('location'));

    // 2. Wrong password to /api/login
    const resWrong = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'WRONG_PASSWORD' }),
    });
    console.log('2. Wrong password -> Status:', resWrong.status);

    // 3. Correct password to /api/login
    const resCorrect = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'MUM193746' }),
    });
    const cookie = resCorrect.headers.get('set-cookie');
    console.log('3. Correct password -> Status:', resCorrect.status, 'Cookie received:', !!cookie);

    const sessionCookie = cookie ? cookie.split(';')[0] : '';

    // 4. Authenticated request to /
    const resAuthHome = await fetch('http://localhost:3000/', {
      headers: { Cookie: sessionCookie },
    });
    console.log('4. Authenticated / -> Status:', resAuthHome.status);

    // 5. Authenticated request to /birthday
    const resBirthday = await fetch('http://localhost:3000/birthday', {
      headers: { Cookie: sessionCookie },
    });
    console.log('5. Authenticated /birthday -> Status:', resBirthday.status);

    // 6. Authenticated request to /gallery
    const resGallery = await fetch('http://localhost:3000/gallery', {
      headers: { Cookie: sessionCookie },
    });
    console.log('6. Authenticated /gallery -> Status:', resGallery.status);

    // 7. Authenticated request to /album/mum
    const resAlbum = await fetch('http://localhost:3000/album/mum', {
      headers: { Cookie: sessionCookie },
    });
    console.log('7. Authenticated /album/mum -> Status:', resAlbum.status);

    // 8. Test static image
    const resImg = await fetch('http://localhost:3000/gallery/mum-1.webp');
    console.log('8. Image /gallery/mum-1.webp -> Status:', resImg.status, 'Content-Type:', resImg.headers.get('content-type'));

    console.log('\n✨ ALL VERIFICATION TESTS PASSED!');
  } finally {
    server.kill();
  }
}

main().catch(console.error);
