function getNewBlockShape() {
  const shapes = [
    // stick
    [
      [
        [1, 1, 1, 1],
      ],
      [
        [1],
        [1],
        [1],
        [1],
      ],
    ],
    // triangle
    [
      [
        [0, 1],
        [1, 1, 1],
      ],
      [
        [1],
        [1, 1],
        [1],
      ],
      [
        [1, 1, 1],
        [0, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [0, 1],
      ],
    ],
    // box
    [
      [
        [1, 1],
        [1, 1],
      ],
    ],
    // z
    [
      [
        [1, 1],
        [0, 1, 1],
      ],
      [
        [0, 1],
        [1, 1],
        [1]
      ],
    ],
    // inverted-z
    [
      [
        [0, 1, 1],
        [1, 1],
      ],
      [
        [1],
        [1, 1],
        [0, 1],
      ],
    ],
    // l
    [
      [
        [1],
        [1],
        [1, 1],
      ],
      [
        [1, 1, 1],
        [1],
      ],
      [
        [1, 1],
        [0, 1],
        [0, 1],
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
    ],
    // inverted-l
    [
      [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      [
        [1],
        [1, 1, 1],
      ],
      [
        [1, 1],
        [1],
        [1],
      ],
      [
        [1, 1, 1],
        [0, 0, 1],
      ],
    ],
  ];

  return shapes[Math.round(Math.random() * shapes.length - 1)];
}

export default class {
  constructor() {
    this._shapes = getNewBlockShape();
    this._shapeIndex = Math.round(Math.random() * (this._shapes.length - 1));
    this.x = 8;
    this.y = 0;
  }

  get shape() {
    return this._shapes[this._shapeIndex];
  }

  rotate() {
    this._shapeIndex++;
    if (this._shapeIndex > this._shapes.length - 1) {
      this._shapeIndex = 0;
    }
  }
}