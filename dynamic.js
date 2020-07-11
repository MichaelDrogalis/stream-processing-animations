function render_svg(styles) {
  ({ svg_width, svg_height } = styles);

  const html = `<svg class="system" width="${svg_width}" height="${svg_height}" style="display: block; margin: auto;"></svg>`
  $(".animation-container").append(html);
}

function render_persistent_query(styles) {
  const midpoint_x = (styles.svg_width / 2);
  const b_len = styles.pq_bracket_len;

  const left_x = midpoint_x - (styles.pq_width / 2);
  const right_x = midpoint_x + (styles.pq_width / 2);
  const top_y = styles.pq_margin_top;
  const bottom_y = top_y + styles.pq_height;

  const line_bottom_y = top_y - 5;

  const html = `<g class="persistent-query-container">
        <line x1="${midpoint_x}" y1="0" x2="${midpoint_x}" y2="${line_bottom_y}" class="pq-connector"></line>

        <path d="M ${left_x + b_len},${top_y} h ${-b_len} v ${b_len}" class="pq"></path>
        <path d="M ${right_x - b_len},${top_y} h ${b_len} v ${b_len}" class="pq"></path>
        <path d="M ${left_x},${bottom_y - b_len} v ${b_len} h ${b_len}" class="pq"></path>
        <path d="M ${right_x},${bottom_y - b_len} v ${b_len} h ${-b_len}" class="pq"></path>
     </g>`

  $(".system").append(html);
}

function render_rows(rows, styles, computed) {
  ({ row_width, row_height, row_margin_left, row_offset_right } = styles);
  ({ part_height } = styles);
  ({ right_x, top_y } = computed);

  let row_x = right_x - row_offset_right - row_width;
  const row_y = top_y + (part_height / 2) - (row_height / 2);

  let row_html = "";
  for (const row of rows) {
    row_html += `<rect height="${row_height}" width="${row_width}" x="${row_x}" y="${row_y}" class="row"></rect>`;
    row_x -= (row_width + row_margin_left);
  }

  return row_html;
}

function render_partition(rows, styles, computed) {
  ({ part_id_margin_top, part_id_margin_left } = styles);
  ({ part, top_y } = computed);

  const midpoint_x = ((styles.svg_width / 3) / 2);
  const b_len = styles.part_bracket_len;

  const left_x = midpoint_x - (styles.part_width / 2);
  const right_x = midpoint_x + (styles.part_width / 2);
  const bottom_y = top_y + styles.part_height;

  const part_html = `
        <text x="${left_x + part_id_margin_left}" y="${top_y + part_id_margin_top}" class="code">${part}</text>`;

  const bracket_html = `
        <path d="M ${left_x + b_len},${top_y} h ${-b_len} v ${b_len}" class="partition"></path>
        <path d="M ${right_x - b_len},${top_y} h ${b_len} v ${b_len}" class="partition"></path>
        <path d="M ${left_x},${bottom_y - b_len} v ${b_len} h ${b_len}" class="partition"></path>
        <path d="M ${right_x},${bottom_y - b_len} v ${b_len} h ${-b_len}" class="partition"></path>`;

  const rows_html = render_rows(rows, styles, {right_x: right_x, top_y: top_y});

  const html = `<g class="partition-container">${part_html}${bracket_html}${rows_html}</g>`;
  $(".system").append(html);
}

function render_partitions(inputs, styles) {
  let top_y = 0;
  ({ part_height, part_margin_bottom } = styles);
  
  for (const [partition, rows] of Object.entries(inputs.s1)) {
    render_partition(rows, styles, {part: partition, top_y: top_y});
    top_y += (part_height + part_margin_bottom);
  }
}

const context = {
  styles: {
    svg_width: 1200,
    svg_height: 450,

    pq_width: 150,
    pq_height: 150,
    pq_margin_top: 50,
    pq_bracket_len: 25,

    part_width: 200,
    part_height: 50,
    part_margin_bottom: 25,
    part_bracket_len: 10,
    part_id_margin_left: -15,
    part_id_margin_top: 8,

    row_width: 15,
    row_height: 15,
    row_margin_left: 10,
    row_offset_right: 15
  },
  inputs: {
    s1: {
      0: [
        { value: 42, t: 1 },
        { value: 40, t: 2 },
        { value: 42, t: 3 },
        { value: 39, t: 4 },
        { value: 51, t: 5 },
        { value: 42, t: 6 }
      ],
      1: [
        { value: 42, t: 1 },
        { value: 40, t: 2 },
        { value: 42, t: 3 },
        { value: 39, t: 4 }
      ],
      2: [
        { value: 42, t: 1 },
        { value: 40, t: 2 }
      ]
    }
  },
  outputs: {
    s2: {
      0: []
    }
  }
};

$(document).ready(function() {
  render_svg(context.styles);
  render_persistent_query(context.styles);
  render_partitions(context.inputs, context.styles);

  // Repaint.
  $(".system").html($(".system").html());
});
