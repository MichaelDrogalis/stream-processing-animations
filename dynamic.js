function build_svg_data(styles) {
  const { svg_width, svg_height } = styles;

  return {
    kind: "svg",
    width: svg_width,
    height: svg_height
  };
}

function build_persistent_query_data(config, styles, computed) {
  const { name } = config;
  const { pq_width, pq_height, pq_margin_top, pq_bracket_len } = styles;
  const { pq_label_margin_left, pq_label_margin_bottom } = styles;
  const { top_y, midpoint_x } = computed;

  const this_top_y = top_y + pq_margin_top;
  const bottom_y = this_top_y + pq_height;
  const left_x = midpoint_x - (pq_width / 2);
  const right_x = midpoint_x + (pq_width / 2);
  const line_bottom_y = this_top_y - 5;
  const b_len = pq_bracket_len;

  return {
    data: {
      kind: "persistent_query",
      line: {
        x1: midpoint_x,
        y1: 0,
        x2: midpoint_x,
        y2: line_bottom_y
      },
      label: {
        name: name,
        x: left_x + pq_label_margin_left,
        y: this_top_y - pq_label_margin_bottom
      },
      brackets: {
        tl: {
          x: left_x + b_len,
          y: this_top_y,
          h: -b_len,
          v: b_len
        },
        tr: {
          x: right_x - b_len,
          y: this_top_y,
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
    },
    state: {
      bottom_y: bottom_y
    }
  };
}

function build_row_data(row, styles, computed) {
  const { row_width, row_height } = styles;
  const { part_height } = styles;
  const { right_x, top_y, row_x } = computed;

  const row_y = top_y + (part_height / 2) - (row_height / 2);

  return {
    width: row_width,
    height: row_height,
    x: row_x,
    y: row_y
  };
}

function build_rows_data (rows, styles, computed) {
  const { row_width, row_margin_left, row_offset_right } = styles;
  const { right_x, top_y } = computed;
  
  const row_x = right_x - row_offset_right - row_width;
  
  const { result } = rows.reduce((all, row) => {
    const row_computed = { right_x: right_x, top_y: top_y, row_x: all.row_x };
    all.result.push(build_row_data(row, styles, row_computed));
    all.row_x -= (row_width + row_margin_left);

    return all;
  }, { result: [], row_x: row_x });

  return result;
}

function build_partition_data(coll, rows, styles, computed) {
  const { svg_width } = styles;
  const { part_bracket_len, part_width, part_height, part_id_margin_top, part_id_margin_left } = styles;
  const { consumer_m_init_margin_left, consumer_m_margin_bottom,
          consumer_m_text_margin_bottom, consumer_m_offset_bottom } = styles;
  const { part, consumers, top_y, midpoint_x, container } = computed;

  const b_len = part_bracket_len;

  const left_x = midpoint_x - (part_width / 2);
  const right_x = midpoint_x + (part_width / 2);
  const bottom_y = top_y + part_height;

  const rows_data = build_rows_data(rows, styles, { right_x: right_x, top_y: top_y });

  return {
    container: container,
    part: part,
    consumers: {
      coll: coll,
      names: consumers,
      init_margin_left: consumer_m_init_margin_left,
      arrow_margin_bottom: consumer_m_margin_bottom,
      text_margin_bottom: consumer_m_text_margin_bottom,
      offset_bottom: consumer_m_offset_bottom
    },
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
  const { svg_width } = styles;
  const { coll_tip_len, coll_foot_len, coll_tip_margin_top } = styles;
  const { part_width, part_height } = styles;
  const { top_y, midpoint_x, container } = computed;

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

function build_collection_data(config, styles, computed) {
  const { name, partitions } = config;
  const { coll_padding_top, coll_margin_bottom, coll_label_margin_bottom } = styles;
  const { part_height, part_margin_bottom } = styles;
  const { midpoint_x } = computed;

  let top_y = computed.top_y + coll_padding_top;

  const container = `coll-${name}`;
  const coll_result = { container: container };
  const partitions_result = [];

  const label_computed = { top_y: top_y, midpoint_x: midpoint_x, container: container };
  const label_data = build_coll_label_data(name, styles, label_computed);

  const { coll_label_data, bottom_y } = label_data;
  top_y = bottom_y + coll_label_margin_bottom;

  for (const [partition, rows] of Object.entries(partitions)) {
    const part_computed = {
      part: partition,
      consumers: [],
      top_y: top_y,
      midpoint_x: midpoint_x,
      container: container
    };

    const part_data = build_partition_data(name, rows, styles, part_computed);
    partitions_result.push(part_data);
    top_y += (part_height + part_margin_bottom);
  }

  return {
    data: {
      kind: "collection",
      container: container,
      label: coll_label_data,
      partitions: partitions_result,
    },
    state: {
      bottom_y: top_y += coll_margin_bottom
    }
  };
}

function render_svg(data) {
  const { width, height } = data;

  const html = `<svg class="system" width="${width}" height="${height}"></svg>`;
  $(".animation-container").append(html);
}

function render_persistent_query(data) {
  const { line, brackets, label } = data;
  const { tl, tr, bl, br } = brackets;

  const html = `
<g class="persistent-query-container">
    <line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" class="pq-connector"></line>
    
    <path d="M ${tl.x},${tl.y} h ${tl.h} v ${tl.v}" class="pq"></path>
    <path d="M ${tr.x},${tr.y} h ${tr.h} v ${tr.v}" class="pq"></path>
    <path d="M ${bl.x},${bl.y} v ${bl.v} h ${bl.h}" class="pq"></path>
    <path d="M ${br.x},${br.y} v ${br.v} h ${br.h}" class="pq"></path>

    <text x="${label.x}" y ="${label.y}" class="code">${label.name}</text>
</g>`;

  $(".system").append(html);
}

function render_rows(data) {
  let row_html = "";
  for (const row of data) {
    const { width, height, x, y } = row;
    row_html += `<rect width="${width}" height="${height}" x="${x}" y="${y}" class="row"></rect>`;
  }

  return row_html;
}

function render_consumer_marker(data) {
  const { part, consumers } = data;
  const { init_margin_left, arrow_margin_bottom, text_margin_bottom, offset_bottom } = consumers;

  let consumer_markers_html = "";

  if (consumers.names != undefined) {
    for (i = 0; i < consumers.names.length; i++) {
      const row = data.rows[0];

      const offset = (i * offset_bottom);
      const x = (row.x + row.width) + init_margin_left;
      const y = (row.y - arrow_margin_bottom) - offset;
      const text_y = (y - text_margin_bottom);
      const name = consumers.names[i];

      consumer_markers_html += `
<g class="collection-${consumers.coll} partition-${part} consumer-${name}">
    <text x="${x}" y="${text_y}" text-anchor="middle" class="code">${name}</text>
    <text x="${x}" y="${y}" class="code">↓</text>
</g>
`;
    }
  }

  return consumer_markers_html;
}

function render_partition(data) {
  const { container, id, brackets, part, rows } = data;
  const { tl, tr, bl, br } = brackets;

  const rows_html = render_rows(rows);
  const consumer_markers_html = render_consumer_marker(data);

  const html = `
<g class="partition-container">
    <text x="${id.x}" y="${id.y}" class="code">${part}</text>

    <path d="M ${tl.x},${tl.y} h ${tl.h} v ${tl.v}" class="partition"></path>        
    <path d="M ${tr.x},${tr.y} h ${tr.h} v ${tr.v}" class="partition"></path>
    <path d="M ${bl.x},${bl.y} v ${bl.v} h ${bl.h}" class="partition"></path>        
    <path d="M ${br.x},${br.y} v ${br.v} h ${br.h}" class="partition"></path>

    ${consumer_markers_html}
    ${rows_html}
</g>
`;

  $("." + container).append(html);
}

function render_coll_label(data) {
  const { container, label, tip, bar, left_foot, right_foot } = data;

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

function render_collection(data) {
  render_coll_container(data.container);
  render_coll_label(data.label);

  for (const partition of data.partitions) {
    render_partition(partition);
  }
}

function coll_y_top(data) {
  return data.label.label.y;
}

function coll_y_bottom(data) {
  const bl = data.partitions.slice(-1)[0].brackets.bl;
  return (bl.y + bl.v);
}

function persistent_query_y_top(data) {
  return data.line.y1;
}

function persistent_query_y_bottom(data) {
  const bl = data.brackets.bl;
  return (bl.y + bl.v);
}

function rendered_y_top(data) {
  switch(data.kind) {
  case "collection":
    return coll_y_top(data)
  case "persistent_query":
    return persistent_query_y_top(data);
  }
}

function rendered_y_bottom(data) {
  switch(data.kind) {
  case "collection":
    return coll_y_bottom(data)
  case "persistent_query":
    return persistent_query_y_bottom(data);
  }
}

function render(data) {
  switch(data.kind) {
  case "svg":
    render_svg(data);
    break;
  case "collection":
    render_collection(data);
    break;
  case "persistent_query":
    render_persistent_query(data);
    break;
  }
}

function collection_translate_y(data, height) {
  data.label.label.y += height;

  data.label.tip.y1 += height;
  data.label.tip.y2 += height;

  data.label.bar.y1 += height;
  data.label.bar.y2 += height;

  data.label.left_foot.y1 += height;
  data.label.left_foot.y2 += height;

  data.label.right_foot.y1 += height;
  data.label.right_foot.y2 += height;

  data.partitions = data.partitions.map(partition => {
    partition.id.y += height;

    partition.brackets.tl.y += height;
    partition.brackets.tr.y += height;
    partition.brackets.bl.y += height;
    partition.brackets.br.y += height;

    partition.rows = partition.rows.map(row => {
      row.y += height;

      return row;
    });

    return partition;
  });
  
  return data;
}

function persistent_query_translate_y(data, height) {
  data.line.y2 += height;

  data.brackets.tl.y += height;
  data.brackets.tr.y += height;
  data.brackets.bl.y += height;
  data.brackets.br.y += height;

  data.label.y += height;
  
  return data;
}

function translate_y(data, height) {
  switch(data.kind) {
  case "collection":
    return collection_translate_y(data, height);
  case "persistent_query":
    return persistent_query_translate_y(data, height);
  }
}

function vertically_center_layout(layout_data) {
  const heights = layout_data.map(components => {
    if (components.length == 1) {
      let data = components[0];

      return rendered_y_bottom(data) - rendered_y_top(data);
    } else {
      let data_1 = components[0];
      let data_2 = components.slice(-1)[0];

      return rendered_y_bottom(data_2) - rendered_y_top(data_1);
    }
  });

  const max_height = Math.max(...heights);

  return heights.map((height, i) => {
    const diff = (max_height - height) / 2;
    const n = layout_data[i].length;
    const each_diff = diff / n;

    return layout_data[i].map(data => {
      return translate_y(data, each_diff);
    });
  });
}

function inverse_map(m) {
  return Object.entries(m).reduce((all, [k, v]) => {
    let new_v = all[v] || [];
    new_v.push(k);
    all[v] = new_v;

    return all;
  }, {})
};

function build_data(node, styles, computed) {
  switch(node.kind) {
  case "collection":
    return build_collection_data(node, styles, computed);

  case "persistent_query":
    return build_persistent_query_data(node, styles, computed);
  }
}

function Topology() {
  this._graph = new graphlib.Graph();
}

Topology.prototype.add_root = function(x) {
  this._graph.setNode(x.name, x);
  return this;
}

Topology.prototype.add_child = function(parents, x) {
  this._graph.setNode(x.name, x);

  parents.forEach(parent => {
    this._graph.setEdge(parent, x.name);
  });

  return this;
}

Topology.prototype.layout_buckets = function() {
  let index = {};
  const seq = graphlib.alg.topsort(this._graph);

  seq.forEach(x => {
    const parents = this._graph.predecessors(x);

    if (parents.length == 0) {
      index[x] = 0;
    } else {
      const parent_indices = parents.reduce((o, k) => {
        o[k] = index[k];
        return o;
      }, {});

      const max_parent = Math.max(...Object.values(parent_indices));

      index[x] = max_parent + 1;
    }
  });

  return inverse_map(index);
}

Topology.prototype.horizontal_layout = function(styles) {
  const { svg_width } = styles;

  const buckets = this.layout_buckets();
  const n = Object.keys(buckets).length;
  const column_width = (svg_width / n);

  const layout = Object.entries(buckets).reduce((all, pair) => {
    const [i, names] = pair;
    const midpoint_x = (i * column_width) + (column_width / 2);

    let result = []
    let top_y = 0;

    names.sort().forEach(name => {
      const node = this._graph.node(name);
      const computed = { top_y: top_y, midpoint_x: midpoint_x };
      const { data, state } = build_data(node, styles, computed);

      top_y = state.bottom_y;
      result.push(data)
    });

    all.push(result);
    return all;
  }, []);

  return vertically_center_layout(layout).flatMap(xs => xs);
}




const styles = {
  svg_width: 1200,
  svg_height: 500,

  pq_width: 150,
  pq_height: 150,
  pq_margin_top: 50,
  pq_bracket_len: 25,
  pq_label_margin_left: 0,
  pq_label_margin_bottom: 10,

  coll_padding_top: 10,
  coll_margin_bottom: 10,
  coll_tip_len: 10,
  coll_foot_len: 10,
  coll_tip_margin_top: 5,
  coll_label_margin_bottom: 10,

  part_width: 200,
  part_height: 50,
  part_margin_bottom: 20,
  part_bracket_len: 10,
  part_id_margin_left: -15,
  part_id_margin_top: 8,

  row_width: 15,
  row_height: 15,
  row_margin_left: 10,
  row_offset_right: 25,

  consumer_m_init_margin_left: -1,
  consumer_m_margin_bottom: 3,
  consumer_m_text_margin_bottom: 15,
  consumer_m_offset_bottom: 30
};

let t = new Topology();

t.add_root({
  name: "s1",
  kind: "collection",
  partitions: {
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
});

t.add_root({
  name: "s3",
  kind: "collection",
  partitions: {
    0: [
      { value: 42, t: 1 },
      { value: 40, t: 2 },
      { value: 42, t: 6 }
    ],
    1: [
      { value: 42, t: 1 }
    ]
  }
});

t.add_child(["s1", "s3"], {
  name: "pq1",
  kind: "persistent_query"
});

t.add_child(["pq1"], {
  name: "s2",
  kind: "collection",
  partitions: {
    0: [],
    1: [],
    2: []
  }
});


$(document).ready(function() {
  const { svg_width } = styles;

  const svg_data = build_svg_data(styles);
  render(svg_data);

  const layout = t.horizontal_layout(styles);
  layout.forEach(data => render(data));

  // Repaint.
  $(".system").html($(".system").html());
});
