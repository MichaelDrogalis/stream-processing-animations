/////////////// Layout data builder

function build_controls_data(styles) {
  return {
    start: 0,
    step: .001
  }
}

function build_svg_data(styles) {
  const { svg_width, svg_height, svg_target } = styles;

  return {
    kind: "svg",
    width: svg_width,
    height: svg_height,
    target: svg_target
  };
}

function build_persistent_query_data(config, styles, computed) {
  const { name } = config;
  const { svg_target } = styles;
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
      target: svg_target,
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
      },
      midpoint_y: bottom_y - (pq_height / 2)
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

function build_rows_data(rows, styles, computed) {
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

function build_dynamic_container_data(styles) {
  const { svg_target, dynamic_target } = styles;

  return {
    container: svg_target,
    dynamic_target: dynamic_target
  };
}

function build_dynamic_row_data(row, styles, computed) {
  const { id, collection, partition, offset } = row;

  const { dynamic_target } = styles;
  const { part_height } = styles;
  const { row_width, row_height } = styles;
  const { d_row_margin_left } = styles;

  const { right_x, top_y } = computed;

  const row_x = right_x + d_row_margin_left;
  const row_y = top_y + (part_height / 2) - (row_height / 2);

  return {
    kind: "dynamic_row",
    container: dynamic_target,
    width: row_width,
    height: row_height,
    x: row_x,
    y: row_y,
    id: id,
    collection: collection,
    partition: partition,
    offset: offset
  };
}

function build_partition_data(coll, rows, styles, computed) {
  const { svg_width } = styles;
  const { part_bracket_len, part_width, part_height, part_id_margin_top, part_id_margin_left } = styles;
  const { row_height } = styles;
  const { part, top_y, midpoint_x, container } = computed;

  const b_len = part_bracket_len;

  const left_x = midpoint_x - (part_width / 2);
  const right_x = midpoint_x + (part_width / 2);
  const bottom_y = top_y + part_height;
  const midpoint_y = top_y + (part_height / 2) - (row_height / 2);

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
    midpoint_y: midpoint_y,
    right_x: right_x,
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
  const { svg_target } = styles;
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
      target: svg_target,
      label: coll_label_data,
      partitions: partitions_result,
    },
    state: {
      bottom_y: top_y += coll_margin_bottom
    }
  };
}

/////////////// Renderer

function render_svg(container, data) {
  const { width, height, target } = data;

  const html = `<svg class="${target}" width="${width}" height="${height}"></svg>`;
  $(container).append(html);
}

function render_controls(container, data) {

  const html = `
<div class="controls">    
    <button class="play">Play</button>
    <button class="pause">Pause</button>
    <button class="restart">Restart</button>
    <input class="progress" step="${data.step}" type="range" min="0" max="100" value="${data.start}"/>
</div>
`;

  $(container).append(html);
}

function render_persistent_query(data) {
  const { line, brackets, label, target } = data;
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

  $("." + target).append(html);
}

function render_rows(data) {
  let row_html = "";
  for (const row of data) {
    const { width, height, x, y } = row;
    row_html += `<rect width="${width}" height="${height}" x="${x}" y="${y}" class="row"></rect>`;
  }

  return row_html;
}

function render_dynamic_container(data) {
  const { container, dynamic_target } = data;

  const html = `<g class="${dynamic_target}"></g>`;
  $("." + container).append(html);
}

function render_dynamic_row(data) {
  const { container, width, height, x, y } = data;
  const { id, collection, partition, offset } = data;

  const html = `<rect width="${width}" height="${height}" x="${x}" y="${y}" class="row id-${id} collection-${collection} partition-${partition} offset-${offset}"></rect>`;

  $("." + container).append(html);  
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
  const { target, container } = data;
  $("." + target).append(`<g class="coll-container ${container}"></g>`);
}

function render_collection(data) {
  render_coll_container(data);
  render_coll_label(data.label);

  for (const partition of data.partitions) {
    render_partition(partition);
  }
}

/////////////// Vertical centering

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

    partition.midpoint_y += height;

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

  data.midpoint_y += height;

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

function build_data(node, styles, computed) {
  switch(node.kind) {
  case "collection":
    return build_collection_data(node, styles, computed);

  case "persistent_query":
    return build_persistent_query_data(node, styles, computed);
  }
}

function add_metadata(component) {
  switch(component.kind) {
  case "collection":
    Object.entries(component.partitions).forEach(([id, partition]) => {
      partition.forEach((row, i) => {
        row.id = uuidv4();
        row.collection = component.name;
        row.partition = id;
        row.offset = i;
      });
    });

    return component;
  default:
    return component;
  }
}

/////////////// Public API

function Specimen() {
  this._graph = new graphlib.Graph();
}

Specimen.prototype.add_root = function(node) {
  this._graph.setNode(node.name, add_metadata(node));
  return this;
}

Specimen.prototype.add_child = function(parents, node) {
  this._graph.setNode(node.name, add_metadata(node));

  parents.forEach(parent => {
    this._graph.setEdge(parent, node.name);
  });

  return this;
}

Specimen.prototype.get_node = function(name) {
  return this._graph.node(name);
}

Specimen.prototype.node_kinds = function() {
  const nodes = this._graph.nodes();
  const vals = nodes.map(node => {
    return this._graph.node(node);
  });
  
  return vals.reduce((all, node) => {
    let group = all[node.kind] || {};
    group[node.name] = node;
    all[node.kind] = group;

    return all;
  }, {});
}

Specimen.prototype.sink_collections = function() {
  return this._graph.sinks();
}

Specimen.prototype.parents = function(name) {
  return this._graph.predecessors(name);
}

Specimen.prototype.layout_buckets = function() {
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

Specimen.prototype.horizontal_layout = function(styles) {
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

      data.name = name;
      top_y = state.bottom_y;
      result.push(data)
    });

    all.push(result);
    return all;
  }, []);

  return vertically_center_layout(layout).flatMap(xs => xs);
}

Specimen.prototype.render = function(layout, container, styles) {
  const controls_data = build_controls_data(styles);
  render_controls(container, controls_data);

  const { svg_width } = styles;
  const svg_data = build_svg_data(styles);
  render_svg(container, svg_data);

  layout.forEach(data => render(data));

  // Repaint.
  $(container).html($(container).html());
}

const styles = {
  svg_target: "system",
  svg_width: 800,
  svg_height: 500,

  dynamic_target: "dynamic-elements",

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

  d_row_margin_left: 10,

  consumer_m_init_margin_left: -1,
  consumer_m_margin_bottom: 3,
  consumer_m_text_margin_bottom: 15,
  consumer_m_offset_bottom: 30
};


/////////////// Runtime

function choose_lowest_timestamp(collections) {
  let choices = []

  Object.entries(collections).forEach(([name, { partitions }]) => {
    Object.entries(partitions).forEach(([id, partition]) => {
      if (partition.length > 0) {
        const props = { collection: name, partition: id };
        choices.push({ ...partition[0], ...props });
      }
    });
  });

  return choices.reduce((result, row) => {
    if (result == undefined) {
      return row;
    } else if (row.t < result.t) {
      return row;
    } else {
      return result;
    }
  }, undefined);
}

/////////////// Util

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
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

function index_by_name(layout) {
  return layout.reduce((all, x) => {
    all[x.name] = x;
    return all;
  }, {});
}

function index_by(xs, k) {
  return xs.reduce((all, x) => {
    all[x[k]] = x;

    return all;
  }, {});
}

function cycle_array(arr) {
  arr.push(arr.shift());
  return arr;
}

function select_keys(m, keys) {
  return keys.reduce((all, key) => {
    all[key] = m[key];
    return all;
  }, {});
}

function relative_add(x) {
  return "+=" + x;
}

/// Animation

function without_sinks(colls, sinks) {
  return Object.entries(colls).reduce((all, [name, coll]) => {
    if (!sinks.includes(coll.name)) {
      all.push(coll);
    }

    return all;
  }, []);
}

function is_drained(non_sinks) {
  return non_sinks.every(coll => {
    return Object.entries(coll.partitions).every(([partition, rows]) => {
      return rows.length == 0;
    });
  });
}

function swap_partitions(colls, offsets, old_row, new_row) {
  colls[old_row.collection].partitions[old_row.partition].shift();

  new_row.offset = offsets[new_row.collection][new_row.partition];
  offsets[new_row.collection][new_row.partition]++;
  
  colls[new_row.collection].partitions[new_row.partition].push(new_row);
}

function initialize_offsets(colls) {
  return Object.entries(colls).reduce((all, [name, { partitions }]) => {    
    all[name] = {};
    Object.entries(partitions).forEach(([partition, rows]) => {
      all[name][partition] = rows.length;
    });

    return all;
  }, {});
}

function run_until_drained(specimen) {
  const kinds = specimen.node_kinds();
  const colls = kinds.collection;
  const pqs = kinds.persistent_query;
  const sinks = specimen.sink_collections();
  const non_sinks = without_sinks(colls, sinks);

  let pq_seq = Object.keys(pqs);
  let actions = [];
  let lineage = {};
  let offsets = initialize_offsets(colls);

  while (!is_drained(non_sinks)) {
    const pq = pq_seq[0];
    const parents = specimen.parents(pq);
    const parent_colls = select_keys(colls, parents);
    const old_row = choose_lowest_timestamp(parent_colls);

    if (old_row) {
      const { fn } = pqs[pq];
      const new_row = fn(old_row);
      new_row.id = uuidv4();

      swap_partitions(colls, offsets, old_row, new_row);
      lineage[new_row.id] = old_row.id;

      const action = {
        from: old_row.collection,
        to: new_row.collection,
        processed_by: pq,
        old_row: old_row,
        new_row: new_row
      };

      actions.push(action);
    }
    
    pq_seq = cycle_array(pq_seq);
  }

  return {
    actions: actions,
    lineage: lineage
  };
}

function build_dynamic_elements_data(layout_index, actions, styles) {
  return actions.reduce((all, action) => {
    const { from, old_row } = action;

    const right_x = layout_index[old_row.collection].partitions[old_row.partition].right_x;
    const top_y = layout_index[old_row.collection].partitions[old_row.partition].brackets.tr.y;

    all[old_row.id] = build_dynamic_row_data(old_row, styles, {
      right_x: right_x,
      top_y: top_y
    });

    return all;
  }, {});
}

function animation_sequence(layout_index, dynamic_elements, actions, styles) {
  const { row_width, row_margin_left, row_offset_right } = styles;

  let seq = [];

  actions.forEach(action => {
    const { old_row, new_row } = action;
    const target = `.id-${old_row.id}`;

    const old_row_position = dynamic_elements[old_row.id];
    const old_row_x = old_row_position.x;
    const old_row_y = old_row_position.y;

    const row_width = dynamic_elements[old_row.id].width;

    const pq_data = layout_index[action.processed_by];
    const pq_enter_x = pq_data.brackets.bl.x;
    const pq_enter_y = pq_data.midpoint_y;
    const pq_exit_x = pq_data.brackets.br.x;
    const pq_exit_y = pq_enter_y;

    const new_part_x = layout_index[new_row.collection].partitions[new_row.partition].brackets.bl.x;
    const new_part_y = layout_index[new_row.collection].partitions[new_row.partition].midpoint_y;

    const new_part_start_x = layout_index[new_row.collection].partitions[new_row.partition].brackets.tr.x;
    const new_part_margin = ((new_row.offset - 1) * row_margin_left);
    const new_part_spacing = (new_row.offset * row_width);

    const new_row_x = new_part_start_x - new_part_margin - row_offset_right - new_part_spacing;

    dynamic_elements[old_row.id].x = new_row_x;
    dynamic_elements[old_row.id].y = new_part_y;

    seq.push({
      id: old_row.id,
      animation: [
        {
          target: target,
          translateX: (pq_enter_x - old_row_x) - row_width,
          translateY: (pq_enter_y - old_row_y)
        },
        {
          target: target,
          translateX: (pq_exit_x - pq_enter_x)
        },
        {
          target: target,
          translateX: (new_part_x - pq_exit_x),
          translateY: (new_part_y - pq_exit_y)
        },
        {
          target: target,
          translateX: (new_row_x - new_part_x)
        }
      ]
    });
  });
  
  return seq;
}

function anime_commands(seq, lineage) {
  const ms_px = 3;
  let commands = [];
  let history = {};
  let t = 0;

  seq.forEach(({ id, animation }) => {
    const intro = 250;
    const entering_motion = (Math.abs(animation[0].translateX) + Math.abs(animation[0].translateY)) * ms_px;
    const crossing_motion = (animation[1].translateX) * ms_px;
    const exiting_motion = (Math.abs(animation[2].translateX) + Math.abs(animation[2].translateY)) * ms_px;
    const settling_motion = (animation[3].translateX) * ms_px;
    const t_offset = history[lineage[id]] || t;

    commands.push({
      params: {
        targets: animation[0].target,
        easing: "linear",
        keyframes: [
          {
            duration: intro,
            opacity: [0, 1]
          },
          {
            duration: entering_motion,
            translateX: relative_add(animation[0].translateX),
            translateY: relative_add(animation[0].translateY)
          },
          {
            duration: crossing_motion,
            translateX: relative_add(animation[1].translateX),
//            fill: ["#6B84FF", "#FFE56B"]
          },
          {
            duration: exiting_motion,
            translateX: relative_add(animation[2].translateX),
            translateY: relative_add(animation[2].translateY)
          },
          {
            duration: settling_motion,
            translateX: relative_add(animation[3].translateX)
          }
        ]
      },
      t: t_offset
    });

    if (!history[lineage[id]]) {
      t += intro + entering_motion;
    }

    history[id] = t_offset + intro + entering_motion + crossing_motion + exiting_motion + settling_motion;
  });

  return commands;
}




$(document).ready(function() {
  let s = new Specimen();

  s.add_root({
    name: "s1",
    kind: "collection",
    partitions: {
      0: [
        { value: 40, t: 2 },
        { value: 41, t: 4 },
        { value: 42, t: 7 }
      ],
      1: [
        { value: 30, t: 1 },
        { value: 31, t: 3 },
        { value: 32, t: 5 },
        { value: 33, t: 6 }
      ],
      2: [
        { value: 20, t: 2 },
        { value: 21, t: 4 },
        { value: 22, t: 6 }
      ],
      3: [
        { value: 10, t: 1 },
        { value: 11, t: 3 },
        { value: 12, t: 4 },
        { value: 13, t: 5 },
        { value: 14, t: 5 },
        { value: 15, t: 5 },
      ]
    }
  });

  s.add_child(["s1"], {
    name: "pq1",
    kind: "persistent_query",
    fn: function(row) {
      return { ...row, ...{ collection: "s2" } };
    }
  });

  s.add_child(["pq1"], {
    name: "s2",
    kind: "collection",
    partitions: {
      0: [],
      1: [],
      2: [],
      3: []
    }
  });

  // s.add_child(["s2"], {
  //   name: "pq2",
  //   kind: "persistent_query",
  //   fn: function(row) {
  //     return { ...row, ...{ collection: "s3" } };
  //   }
  // });

  // s.add_child(["pq2"], {
  //   name: "s3",
  //   kind: "collection",
  //   partitions: {
  //     0: [],
  //     1: [],
  //     2: [],
  //     3: []
  //   }
  // });

  const container = ".animation-container-1";
  const layout = s.horizontal_layout(styles);
  s.render(layout, container, styles);

  const layout_index = index_by_name(layout);
  const { actions, lineage } = run_until_drained(s);

  const dynamic_container_data = build_dynamic_container_data(styles);
  const dynamic_data = build_dynamic_elements_data(layout_index, actions, styles);

  render_dynamic_container(dynamic_container_data);
  Object.values(dynamic_data).forEach(data => render_dynamic_row(data));
  $(container).html($(container).html());

  const animations = animation_sequence(layout_index, dynamic_data, actions, styles);
  const commands = anime_commands(animations, lineage);

  var controlsProgressEl = $(container + " > .controls > .progress");

  const timeline = anime.timeline({
    update: function(anim) {
      controlsProgressEl.val(timeline.progress);
    }
  });

  $(container + " > .controls > .play").click(timeline.play);
  $(container + " > .controls > .pause").click(timeline.pause);
  $(container + " > .controls > .restart").click(timeline.restart);

  controlsProgressEl.on('input', function() {
    timeline.seek(timeline.duration * (controlsProgressEl.val() / 100));
  });

  commands.forEach(c => timeline.add(c.params, c.t));
});
