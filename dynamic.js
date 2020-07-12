function build_svg_data(styles) {
  ({ svg_width, svg_height } = styles);

  return {
    width: svg_width,
    height: svg_height
  };
}

function build_persistent_query_data(styles, computed) {
  ({ pq_width, pq_height, pq_margin_top, pq_bracket_len } = styles);
  ({ midpoint_x } = computed);

  const left_x = midpoint_x - (pq_width / 2);
  const right_x = midpoint_x + (pq_width / 2);
  const top_y = pq_margin_top;
  const bottom_y = top_y + pq_height;
  const line_bottom_y = top_y - 5;
  const b_len = pq_bracket_len;

  return {
    line: {
      x1: midpoint_x,
      y1: 0,
      x2: midpoint_x,
      y2: line_bottom_y
    },
    brackets: {
      tl: {
        x: left_x + b_len,
        y: top_y,
        h: -b_len,
        v: b_len
      },
      tr: {
        x: right_x - b_len,
        y: top_y,
        h: b_len,
        v: b_len
      },
      bl: {
        x: left_x,
        y: bottom_y - b_len,
        v: b_len,
        h: b_len
      },
      br: {
        x: right_x,
        y: bottom_y - b_len,
        v: b_len,
        h: -b_len
      }
    }
  };
}

function build_row_data(row, styles, computed) {
  ({ row_width, row_height } = styles);
  ({ part_height } = styles);
  ({ right_x, top_y, row_x } = computed);

  const row_y = top_y + (part_height / 2) - (row_height / 2);

  return {
    width: row_width,
    height: row_height,
    x: row_x,
    y: row_y
  };
}

function build_rows_data (rows, styles, computed) {
  ({ row_width, row_margin_left, row_offset_right } = styles);
  ({ right_x, top_y } = computed);
  
  const row_x = right_x - row_offset_right - row_width;
  
  ({ result } = rows.reduce((all, row) => {
    const row_computed = { right_x: right_x, top_y: top_y, row_x: all.row_x };
    all.result.push(build_row_data(row, styles, row_computed));
    all.row_x -= (row_width + row_margin_left);

    return all;
  }, { result: [], row_x: row_x }));

  return result;
}

function build_partition_data(rows, styles, computed) {
  ({ svg_width } = styles);
  ({ part_bracket_len, part_width, part_height, part_id_margin_top, part_id_margin_left } = styles);
  ({ part, top_y, midpoint_x, container } = computed);

  const b_len = part_bracket_len;

  const left_x = midpoint_x - (part_width / 2);
  const right_x = midpoint_x + (part_width / 2);
  const bottom_y = top_y + part_height;

  const rows_data = build_rows_data(rows, styles, { right_x: right_x, top_y: top_y });

  return {
    container: container,
    part: part,
    id: {
      x: left_x + part_id_margin_left,
      y: top_y + part_id_margin_top
    },
    brackets: {
      tl: {
        x: left_x + b_len,
        y: top_y,
        h: -b_len,
        v: b_len
      },
      tr: {
        x: right_x - b_len,
        y: top_y,
        h: b_len,
        v: b_len
      },
      bl: {
        x: left_x,
        y: bottom_y - b_len,
        v: b_len,
        h: b_len
      },
      br: {
        x: right_x,
        y: bottom_y - b_len,
        v: b_len,
        h: -b_len
      }
    },
    rows: rows_data
  };
}

function build_coll_label_data(coll, styles, computed) {
  ({ svg_width } = styles);
  ({ coll_tip_len, coll_foot_len, coll_tip_margin_top } = styles);
  ({ part_width, part_height } = styles);
  ({ top_y, midpoint_x, container } = computed);

  const left_x = midpoint_x - (part_width / 2);
  const right_x = midpoint_x + (part_width / 2);

  const coll_tip_top_y = top_y + coll_tip_margin_top;
  const coll_tip_bottom_y = coll_tip_top_y + coll_tip_len;
  const coll_foot_bottom_y = coll_tip_bottom_y + coll_foot_len;

  return {
    bottom_y: coll_foot_bottom_y,
    coll_label_data : {
      container: container,
      label: {
        coll: coll,
        x: midpoint_x,
        y: top_y
      },
      tip: {
        x1: midpoint_x,
        y1: coll_tip_top_y,
        x2: midpoint_x,
        y2: coll_tip_bottom_y
      },
      bar: {
        x1: left_x,
        y1: coll_tip_bottom_y,
        x2: right_x,
        y2: coll_tip_bottom_y
      },
      left_foot: {
        x1: left_x,
        y1: coll_tip_bottom_y,
        x2: left_x,
        y2: coll_foot_bottom_y
      },
      right_foot: {
        x1: right_x,
        y1: coll_tip_bottom_y,
        x2: right_x,
        y2: coll_foot_bottom_y
      }
    }
  };
}

function build_colls_data(colls, styles, computed) {
  ({ coll_margin_bottom, coll_label_margin_bottom } = styles);
  ({ part_height, part_margin_bottom } = styles);
  ({ midpoint_x } = computed);

  let top_y = 10;
  let result = [];

  for (const [coll, partitions] of Object.entries(colls)) {
    const container = `coll-${coll}`;
    const coll_result = { container: container };
    const partitions_result = []

    const label_computed = { top_y: top_y, midpoint_x: midpoint_x, container: container };
    const label_data = build_coll_label_data(coll, styles, label_computed);

    ({ coll_label_data, bottom_y } = label_data);
    top_y = bottom_y + coll_label_margin_bottom;

    for (const [partition, rows] of Object.entries(partitions)) {
      const part_computed = { part: partition, top_y: top_y, midpoint_x: midpoint_x, container: container };
      const part_data = build_partition_data(rows, styles, part_computed);

      partitions_result.push(part_data);
      top_y += (part_height + part_margin_bottom);
    }

    coll_result.label = coll_label_data;
    coll_result.partitions = partitions_result;
    result.push(coll_result);

    top_y += coll_margin_bottom;
  }

  return result;
}

function render_svg(data) {
  ({ width, height } = data);

  const html = `<svg class="system" width="${width}" height="${height}"></svg>`;
  $(".animation-container").append(html);
}

function render_persistent_query(data) {
  ({ line, brackets } = data);
  ({ tl, tr, bl, br } = brackets);

  const html = `
<g class="persistent-query-container">
    <line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" class="pq-connector"></line>
    
    <path d="M ${tl.x},${tl.y} h ${tl.h} v ${tl.v}" class="pq"></path>
    <path d="M ${tr.x},${tr.y} h ${tr.h} v ${tr.v}" class="pq"></path>
    <path d="M ${bl.x},${bl.y} v ${bl.v} h ${bl.h}" class="pq"></path>
    <path d="M ${br.x},${br.y} v ${br.v} h ${br.h}" class="pq"></path>
</g>`;

  $(".system").append(html);
}

function render_rows(data) {
  let row_html = "";
  for (const row of data) {
    ({ width, height, x, y } = row);
    row_html += `<rect width="${width}" height="${height}" x="${x}" y="${y}" class="row"></rect>`;
  }

  return row_html;
}

function render_partition(data) {
  ({ container, id, brackets, part, rows } = data);
  ({ tl, tr, bl, br } = brackets);

  const rows_html = render_rows(rows, styles, { right_x: right_x, top_y: top_y });

  const html = `
<g class="partition-container">
    <text x="${id.x}" y="${id.y}" class="code">${part}</text>

    <path d="M ${tl.x},${tl.y} h ${tl.h} v ${tl.v}" class="partition"></path>        
    <path d="M ${tr.x},${tr.y} h ${tr.h} v ${tr.v}" class="partition"></path>
    <path d="M ${bl.x},${bl.y} v ${bl.v} h ${bl.h}" class="partition"></path>        
    <path d="M ${br.x},${br.y} v ${br.v} h ${br.h}" class="partition"></path>

    ${rows_html}
</g>
`;

  $("." + container).append(html);
}

function render_coll_label(data) {
  ({ container, label, tip, bar, left_foot, right_foot } = data);

  const html =`
<g class="coll-label">
    <text x="${label.x}" y="${label.y}" text-anchor="middle" class="code">${label.coll}</text>
    <line x1="${tip.x1}" y1="${tip.y1}" x2="${tip.x2}" y2="${tip.y2}" class="coll-connector"></line>
    <line x1="${bar.x1}" y1="${bar.y1}" x2="${bar.x2}" y2="${bar.y2}" class="coll-connector"></line>
    <line x1="${left_foot.x1}" y1="${left_foot.y1}" x2="${left_foot.x2}" y2="${left_foot.y2}" class="coll-connector"></line>
    <line x1="${right_foot.x1}" y1="${right_foot.y1}" x2="${right_foot.x2}" y2="${right_foot.y2}" class="coll-connector"></line>
</g>`;

  $("." + container).append(html);
}

function render_coll_container(data) {
  $(".system").append(`<g class="coll-container ${data}"></g>`);
}

function render_colls(data) {
  for (const coll of data) {
    render_coll_container(coll.container);
    render_coll_label(coll.label);

    for (const partition of coll.partitions) {
      render_partition(partition);
    }
  }
}

const context = {
  styles: {
    svg_width: 1200,
    svg_height: 500,

    pq_width: 150,
    pq_height: 150,
    pq_margin_top: 50,
    pq_bracket_len: 25,

    coll_margin_bottom: 15,
    coll_tip_len: 10,
    coll_foot_len: 10,
    coll_tip_margin_top: 5,
    coll_label_margin_bottom: 15,

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
    },
    s3: {
      0: [
        { value: 42, t: 1 },
        { value: 40, t: 2 },
        { value: 42, t: 6 }
      ],
      1: [
        { value: 42, t: 1 }
      ]
    }
  },
  outputs: {
    s2: {
      0: [],
      1: [],
      2: []
    },
  }
};

$(document).ready(function() {
  ({ inputs, outputs, styles } = context);
  ({ svg_width } = styles);

  const svg_data = build_svg_data(styles);
  render_svg(svg_data);

  const inputs_data = build_colls_data(inputs, styles, { midpoint_x: ((svg_width / 3) / 2) });
  render_colls(inputs_data);

  const pq_data = build_persistent_query_data(styles, { midpoint_x: (svg_width / 2) });
  render_persistent_query(pq_data);

  const outputs_data = build_colls_data(outputs, styles, { midpoint_x: ((svg_width * (2 / 3)) + ((svg_width / 3) / 2)) });
  render_colls(outputs_data);

//  console.log(inputs_data);

  // Repaint.
  $(".system").html($(".system").html());
});
