import test from "./data.json" with { type: "json" };

const element = document.getElementById('about');

element.innerHTML = test.test;