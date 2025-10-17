import './style.css';
import { Game } from './game/Game.js';
import { GameUI } from './ui/GameUI.js';

const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('span');
const section = document.querySelector('section');

const ui = new GameUI(canvas, scoreEl);
let game = null;

section.addEventListener('click', () => {
  if (!game) {
    game = new Game(ui);
  }
  game.start();
  section.remove();
});