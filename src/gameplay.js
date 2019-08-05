import controls from './controls';
import Block from './block';

function render_pixel(ctx, size, x, y) {
  const border = 2;
  ctx.fillRect(x * size, y * size - (size * 2), size, border); // top
  ctx.fillRect(x * size, y * size + size - border - (size * 2), size, border); // bottom
  ctx.fillRect(x * size, y * size - (size * 2), border, size); // left
  ctx.fillRect(x * size + size - border, y * size - (size * 2), border, size); // right
  ctx.fillRect(x * size + border * 2, y * size + border * 2 - (size * 2), size / 2, size / 2); // middle
}

function render_block(ctx, size, block) {
  block
    .shape
    .forEach((columns, y) => {
      columns
        .forEach((filled, x) => {
          if (!filled) return;
          render_pixel(ctx, size, x + block.x, y + block.y);
        });
    });
}

function render_wall(ctx, size, wall) {
  wall
    .forEach((columns, y) => {
      columns.forEach((filled, x) => {
        if (filled) render_pixel(ctx, size, x, y);
      });
    });
}

function build_empty_wall(nlines) {
  const wall = [];

  for (let i = 0; i < nlines; i++) {
    const cols = [];
    for (let j = 0; j < 20; j++) {
      cols.push(0);
    }
    wall.push(cols);
  }

  return wall;
}

function merge_block_with_wall(wall, block) {
  block
    .shape
    .forEach((columns, blockY) => {
      const y = blockY + block.y;
      columns
        .forEach((filled, blockX) => {
          const x = block.x + blockX;
          if (filled) wall[y][x] = 1;
        });
    });
}

export default function() {
  const $gameplay = document.querySelector('.gameplay');
  const $canvas = document.querySelector('.canvas');

  const WIDTH = $canvas.clientWidth;
  const BLOCK_SIZE = WIDTH / 20;
  const NLINES = Math.floor($canvas.clientHeight / BLOCK_SIZE) + 2;
  const HEIGHT = (NLINES - 2) * BLOCK_SIZE;
  
  $canvas.style.height = `${HEIGHT}px`;
  $canvas.width = WIDTH;
  $canvas.height = HEIGHT;

  const ctx = $canvas.getContext('2d');
  ctx.fillStyle = `rgb(108, 108, 108)`;
  
  const state = {
    block: new Block(),
    wall: build_empty_wall(NLINES),
    lastFrame: 0,
  }

  function update(ts) {
    const diffts = ts - state.lastFrame;
    const { block, wall } = state;

    if (diffts > 300) {
      block.y += 1;

      if (block.collided(wall)) {
        block.y -= 1;
        merge_block_with_wall(wall, block);
        state.block = new Block();
      }

      state.lastFrame = ts;
    }
    requestAnimationFrame(render);
  }
  
  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    render_block(ctx, BLOCK_SIZE, state.block);
    render_wall(ctx, BLOCK_SIZE, state.wall);
    requestAnimationFrame(update);
  }

  controls.on(controls.KEYS.LEFT, () => {
    const { block, wall } = state;
    
    // move block
    block.x -= 1;

    // undo if block collides or is out of sight
    if (block.x < 0 || block.collided(wall)) {
      block.x += 1;
    } 
  });

  controls.on(controls.KEYS.RIGHT, () => {
    const { block, wall } = state;

    // move block
    block.x += 1;

    const blockMaxX = block.x + block
      .shape
      .reduce((prev, curr) => {
        const length = curr.length - 1;
        if (length > prev) prev = length;
        return prev;
      }, 0);

    // undo if block collides or is out of sight
    if (blockMaxX > 19 || block.collided(wall)) {
      block.x -= 1;
    }
  });

  controls.on(controls.KEYS.UP, () => {
    const { block, wall } = state;

    // rotates block
    block.rotate();

    const blockMaxX = block.x + block
      .shape
      .reduce((prev, curr) => {
        const length = curr.length - 1;
        if (length > prev) prev = length;
        return prev;
      }, 0);
    const blockMaxY = block.x + (block.shape.length - 1);

    // undo if block collides or is out of sight
    if (
      blockMaxX > 19 ||
      blockMaxY > NLINES ||
      block.collided(wall)
    ) block.unrotate();
  });

  $gameplay.classList.remove('hidden');
  update();
}