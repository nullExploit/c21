const avatar = document.getElementById("avatar");
const preview = document.getElementById("preview");

const loadFile = (evt) => {
  preview.src = URL.createObjectURL(evt.target.files[0]);
  preview.onload = function () {
    URL.revokeObjectURL(preview.src); // free memory
  };
};
