## Bab 01

### Bagian 1
Kode implementasi fungsi:
```javascript
async function promiseQueue(tasks) {
  const results = new Array(tasks.length);

  for (let i = 0; i < tasks.length; i++) {
    try {
      results[i] = await tasks[i]();
    } catch (err) {
      results[i] = err instanceof Error
        ? err : new Error(String(err), { cause: err })
    }
  }

  return results;
}
```

### Bagian 2

#### 1. Tuliskan prompt yang Anda gunakan untuk membantu menyelesaikan soal ini.
```
write an async function in Javascript that takes an array of functions that return a promise. the function should then execute the promises sequentially (from the first element to the last, one by one) and store the fulfillment value (or rejection reason if the promise is rejected) in the output array. the return value of that function should be the output array of the same size as the input argument.
```
Model: Claude Sonnet 5 Medium

#### 2. Mengapa Anda memilih prompt tersebut? Jelaskan alasan dan strategi prompting Anda.

Prompt tersebut menjelaskan secara gamblang seluruh hal krusial yang diperlukan dari fungsi untuk bekerja seperti yang diharapkan, sesuai dengan petunjuk yang diberikan pada dokumen penugasan. Hal-hal tersebut meliputi parameter, tahapan eksekusi, serta nilai kembaliannya. Saya sengaja tidak menjelaskan secara lebih detail mengenai tahapan flow fungsi yang saya harapkan karena saya berasumsi bahwa AI mungkin akan lebih tahu mengenai detail implementasi yang paling baik untuk kebutuhan ini. Kemudian, saya memilih menuliskan prompt dalam bahasa inggris untuk mendapatkan hasil terbaik dari model yang kemungkinan dilatih dengan dataset yang sebagian besar berbahasa inggris.

#### 3. Apakah hasil dari AI langsung digunakan, atau ada bagian yang dimodifikasi? Jelaskan.

Hasil dari AI sudah sedikit saya modifikasi. Pada blok `catch`, saya mengubah line berikut:
```javascript
results[i] = err
// menjadi
results[i] = err instanceof Error
  ? err : new Error(String(err), { cause: err })
```
Disamping itu, saya juga membuat perubahan minor berupa modifikasi nama fungsi dan parameter-nya agar sesuai dengan contoh blueprint pada dokumen penugasan.

#### 4. Apa alasan melakukan modifikasi? (readable, error handling, kompleksitas, coding style)

Modifikasi pada blok `catch` saya lakukan untuk mengurangi ambiguitas antara bentuk nilai dari promise yang fulfilled dengan rejected. Dengan perubahan ini, kita bisa tahu bahwa promise yang rejected akan memiliki memuat hasil berupa object Error. Secara readability dan style, menurut saya kode buatan AI ini sudah sesuai dengan standar penulisan kode Javascript saya, sehingga tidak perlu dilakukan perubahan.

#### 5. Apa kelebihan dari solusi yang Anda gunakan?

Implementasi ini memastikan bahwa array keluaran akan selalu memiliki panjang yang sama dengan array input, sehingga memudahkan dalam melakukan consume data. Selain itu, setiap task dijalankan secara independen, sehingga apabila terdapat promise yang gagal/rejected, hal ini tidak lantas menyebabkan tasks lainnya menjadi tidak dijalankan.

#### 6. Apa kekurangan dari solusi tersebut?

Meskipun modifikasi yang saya lakukan sebelumnya secara teoritis mengurangi ambiguitas data antara fulfilled/rejected, implementasi tersebut gagal menangani kasus apabila promise fulfills dengan object Error sebagai hasilnya (walaupun mungkin sangat tidak umum). Selain itu, pemanggil hanya mendapat result ketika seluruh promises selesai dijalankan, tidak ada mekanisme pengiriman progres sementara. Pada kasus tasks dengan item sangat banyak (ribuan atau lebih), pengiriman progres sementara mungkin dibutuhkan untuk UI/UX.

#### 7. Jika diberi kesempatan untuk memperbaikinya, apa yang akan Anda ubah?

Menurut saya, implementasi ini sudah cukup baik dalam meng-cover berbagai kasus-kasus yang umum. Walaupun begitu, ada beberapa kemungkinan perbaikan yang dapat dilakukan, diantaranya:

* Agar nilai result tidak lagi ambigu, akan lebih baik jika fungsi mengembalikan array of objects seperti berikut:
  ```javascript
  results[i] = { status: 'fulfilled', value };
  // atau
  results[i] = { status: 'rejected', reason: err };
  ```
  Dengan begitu, kita akan dengan mudah membedakan mana promise yang success dan mana yang failed.

* Untuk memberitahu caller mengenai progres eksekusi task, saya mungkin akan menambahkan callback parameter opsional `onProgress` yang akan dipanggil pada setiap akhir iterasi task. Dengan begitu, caller dapat mengetahui informasi progres secara berkala, yang mungkin juga dapat ditampilkan ke user untuk meningkatkan user experience.

## Bab 02

### Bagian 1

#### 1. Jelaskan alur program di atas langkah demi langkah, dari awal hingga menghasilkan output.

Pada program tersebut, fungsi `promiseQueue` menerima parameter tunggal berupa variabel `tasks`. Di awal fungsi, variabel `results` berupa array kosongan dideklarasikan dan diinisialisasi. Varibel ini nantinya akan digunakan untuk menampung nilai fulfillment promises. Selanjutnya, dilakukan perulangan terhadap seluruh elemen pada `tasks` menggunakan `for...of`. Pada setiap iterasi, fungsi berisi promise pada setiap elemen dijalankan dan nilai kembaliannya di-push ke variabel `results` satu per satu. Terakhir, variabel `results` dikembalikan sebagai return value dari fungsi ini.

#### 2. Mengapa fungsi menggunakan async/await? Apa keuntungannya dibandingkan menggunakan .then()?

Fitur `async/await` ini merupakan fitur baru dari ECMAScript dan dikembangkan diatas `Promise` sebagai syntactic sugar. Fungsi tersebut menggunakan `async/await` agar kode asynchronous dapat ditulis dan dibaca secara sekuensial layaknya kode synchronous biasa, tanpa perlu berurusan dengan callback hell ataupun "then" chain. Keuntungan utama dari `async/await` dibandingkan `.then()` adalah lebih mudah dibaca dan lebih mudah dalam menangani error karena dapat menggunakan blok `try...catch` biasa.

#### 3. Mengapa menggunakan for...of? Apa yang terjadi jika tasks.forEach(async (task) => { await task(); }) digunakan? Apakah hasilnya sama?

Perulangan `for...of` digunakan karena memungkinkan eksekusi kode blok asynchronous secara sekuensial menggunakan `async/await`. Hal yang sama tidak terjadi jika menggunakan perulangan `forEach`. Walaupun sekilas sama-sama menggunakan `async/await`, tetapi `forEach` memanggil callback untuk setiap elemen secara langsung tanpa jeda, dengan konteks asynchronous function-nya masing-masing. Akibatnya, semua task akan dieksekusi secara sekaligus secara paralel tanpa menunggu satu sama lain, dan array `results` akan tetap kosong ketika nilainya dikembalikan.

#### 4. Apa tujuan array results? Mengapa hasil task disimpan ke dalam array tersebut?

Array `results` digunakan untuk menampung nilai fullfillment/rejection dari hasil penjalanan promise. Idealnya, setiap eksekusi sebuah task akan menambahkan satu elemen ke dalam array `results`. Hasil task perlu disimpan ke dalam array ini agar nantinya dapat dikembalikan ke caller untuk diproses lebih lanjut.

### Bagian 2

#### 5. Apa yang akan terjadi ketika fungsi dijalankan dengan tasks di atas? Jelaskan output atau error yang muncul.

Ketika fungsi dijalankan, muncul error berikut `Uncaught (in promise) Task 2 Error`. Error ini muncul karena saat task kedua dijalankan, fungsi mengembalikan rejected promise sehingga menyebabkan error.

#### 6. Apakah task ketiga akan tetap dijalankan? Jelaskan alasannya.

Task ketiga tidak akan dijalankan karena eksekusi fungsi berhenti ketika muncul error di task kedua. Ketika sebuah promise mengalami reject dalam blok fungsi `async`, keyword `await` akan memperlakukan rejection tersebut sebagai error, akibatnya eksekusi keseluruhan fungsi terhenti seketika.

#### 7. Menurut Anda, apakah perilaku tersebut sudah sesuai? Berikan alasan teknis Anda.

Perilaku tersebut sesuai apabila fungsi memang didesain untuk "fail fast" apabila terjadi error di salah satu task. Pada kasus ini, output dari task lainnya akan diabaikan seluruhnya apabila salah satu task mengalami error. Namun, menurut saya, di kebanyakan kasus perilaku "fail fast" ini justru kurang ideal karena kita akan kehilangan informasi mengenai task-task yang mungkin berhasil dijalankan sebelumnya. Akan lebih baik apabila nilai task-task yang berhasil tetap disimpan, walaupun terdapat satu atau beberapa task yang gagal dieksekusi, sehingga caller/user dapat menilik task mana yang error dan apa alasannya.

#### 8. Bagaimana Anda akan memperbaikinya agar: task berikutnya tetap dijalankan, error dapat dicatat, dan seluruh hasil tetap dikembalikan? Jelaskan pendekatan yang akan digunakan (tidak harus kode lengkap).

Untuk memperbaiki fungsi agar sesuai dengan permintaan tersebut, kita dapat menambahkan blok `try...catch` pada setiap iterasi. Dengan begitu, satu error/rejection tidak akan menyebabkan seluruh fungsi berhenti dijalankan. Berikut perubahan minimal yang mungkin dapat dilakukan:
```javascript
for (const task of tasks) {
  try {
    const result = await task();
    results.push(result);
  } catch (err) {
    results.push(err);
  }
}
```

### Bagian 3

#### 9. Apa kelebihan dari solusi yang dihasilkan AI? (readable, sederhana, dll.)

Solusi yang dihasilkan oleh AI ini lebih sederhana karena tidak menggunakan fitur advanced seperti `try...catch`. Selain itu, penggunaan `for...of` untuk array juga cenderung lebih mudah untuk dibaca dibanding jenis perulangan lain.

#### 10. Apa kekurangan dari solusi tersebut? (tidak ada error handling, tidak mendukung concurrency, dll.)

Kekurangan dari solusi yang diberikan utamanya adalah tidak adanya error handling sehingga fungsi bisa jadi terhenti lebih cepat dari ekspetasi, sehingga kita dapat kehilangan seluruh hasil yang sudah dijalankan sebelum error terjadi. Selain itu, fungsi ini juga tidak memiliki fitur pendukung lain yang masuk akal untuk ditambahkan, seperti opsi untuk menjalankan task secara concurrent dan pengiriman progres sementara melalui callback.

#### 11. Apakah Anda akan langsung menggunakan kode tersebut di production? Jelaskan alasannya.

Tidak, saya akan menyesuaikan kode fungsi tersebut terlebih dahulu berdasarkan kebutuhan program secara keseluruhan. Penyesuaian yang paling penting untuk dilakukan adalah untuk menambahkan error handling, karena promise reject sangat mungkin terjadi, terutama apabila menggunakan kode dari library eksternal didalamnya.

#### 12. Apakah ada pendekatan lain? (Promise chaining, Array.reduce(), recursive) Jelaskan kelebihan dan kekurangan pendekatan yang Anda pilih.

Ya, terdapat beberapa pendekatan lain yang bisa digunakan selain `async/await` + `for...of`, diantaranya adalah menggunakan `Array.reduce()`, pemanggilan fungsi secara rekursif, dan manual promise chaining. Namun, pendekatan yang pertama menurut saya paling ideal untuk digunakan karena paling mudah dibaca sehingga lebih mudah juga untuk di-debug. Meskipun begitu, karena menggunakan fitur yang relatif baru di Javascript, pendekatan ini mungkin membutuhkan transpiler/polyfill jika ingin dijalankan pada browser yang sangat tua (misalnya Internet Explorer).
