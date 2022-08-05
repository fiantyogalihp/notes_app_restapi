const { nanoid } = require("nanoid");
const notes = require("./notes");

// * menyimpan catatan
const addNoteHandler = (req, h) => {
  // * Client mengirim data catatan (title, tags, dan body) yang akan disimpan dalam bentuk JSON melalui body request.
  const { title, tags, body } = req.payload;

  // * membuat id string yg bersifat unique dengan bantuan package nanoid
  const id = nanoid(16);
  // * membuat createdAt & updateAt untuk info kapan notes disimpan
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // * Kita sudah memiliki properti dari objek catatan secara lengkap. Sekarang, saatnya kita masukan nilai-nilai tersebut ke dalam array notes menggunakan method push().
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  // * kita perlu menentukan apakah data newNote sudah masuk ke dalam notes atau belum
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // * ketika success atau gagal berikan response pada client
  if (isSuccess) {
    const response = h.response({
      status: `Success`,
      message: `Data berhasil Ditambahkan`,
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // * akan gagal jika tidak terpenuhi
  const response = h.response({
    status: `Failed`,
    message: `Catatan Gagal Ditambahkan`,
    data: {
      noteId: id,
    },
  });
  response.code(500);
  return response;
};

// * menampilkan notes
const getAllNotesHandler = () => ({
  status: `Success`,
  data: {
    notes,
  },
});

// * menampilkan notes by id
const getNoteByIdHandler = (req, h) => {
  // * dapatkan terlebih dahulu nilai id dari instance req.params
  const { id } = req.params;

  // * dapatkan objek note dengan id tersebut dari objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya.

  const note = notes.filter((n) => n.id === id)[0];

  // * Kita kembalikan fungsi handler dengan data beserta objek note di dalamnya. Namun sebelum itu, pastikan dulu objek note tidak bernilai undefined. Bila undefined, kembalikan dengan respons gagal.
  if (note !== undefined) {
    return {
      status: `Success`,
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: `Fail`,
    message: `Data tidak ditemukan!`,
  });
  response.code(404);
  return response;
};

// * mengubah notes
const editNoteByIdHandler = (req, h) => {
  // * dapatkan id nya
  const { id } = req.params;

  // * dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
  const { title, tags, body } = req.payload;

  // * dapatkan nilai terbaru updatedAt
  const updatedAt = new Date().toISOString();

  // * memperbarui data menggunakan indexing array
  // * Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex().
  const index = notes.findIndex((note) => note.id === id);

  // * gunakan statement if else untuk mencari jika id yg dicari ditemukan, jika tidak ditemukan makan index akan bernilai '-1'
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: `Success`,
      message: `Catatan Berhasil Diperbaharui`,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: `Failed`,
    message: `Catatan Gagal Diperbaharui, id tidak ditemukan`,
  });
  response.code(404);
  return response;
};

// * menghapus notes
const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index);

    const response = h.response({
      status: `Success`,
      message: `Catatan Berhasil Dihapus`,
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: `Failed`,
    message: `Catatan Gagal Dihapus, id tidak ditemukan`,
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
