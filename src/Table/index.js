import React from "react";
import PropTypes from "prop-types";
import BaseTable from "./BaseTable";
import ScrollBar from "./HorizontalScrollBar";
import classnames from "classnames";
import "./index.scss";
function querySelectorAll(selector, context) {
  /* istanbul ignore next */
  const ctx = context || document;
  const dom = ctx.querySelectorAll(selector);
  return Array.prototype.slice.call(dom, 0);
}

class Table extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    rowKey: PropTypes.string,
    offsetTop: PropTypes.number
  };

  state = {
    top: 0,
    rowsHeight: []
  };
  maxTop = 0;
  $tbody = null;
  content = null;
  fixedLeft = false;
  fixedRight = false;
  cacheColumns = [];
  cacheData = null;

  constructor(props) {
    super(props);
    this.content = React.createRef();
    this.$tbody = React.createRef();
    // this.$left = React.createRef()
    // this.$right = React.createRef()
  }

  get formatData() {
    const { columns } = this.props;
    if (columns === this.cacheColumns && this.cacheData) {
      return this.cacheData;
    }
    this.cacheColumns = columns;
    const left = [];
    const right = [];
    columns.forEach(each => {
      const { fixed } = each;
      if (!fixed) {
        return;
      }
      if (fixed === "right") {
        right.push(each);
        return;
      }
      left.push(each);
    });
    this.fixedLeft = !!left.length;
    this.fixedRight = !!right.length;
    this.cacheData = {
      left,
      body: columns,
      right
    };
    return this.cacheData;
  }

  // get tableContentStyle() {
  //   const { paddingLeft, paddingRight } = this.state
  //   return {
  //     paddingLeft: paddingLeft + 'px',
  //     paddingRight: paddingRight + 'px'
  //   }
  // }

  hoverClass(e, type) {
    const tr = e.target.closest("tr");
    if (!tr) {
      return;
    }
    const idx = tr.rowIndex;
    const trs = querySelectorAll(
      `tbody tr:nth-child(${idx})`,
      this.content.current
    );
    trs.forEach(each => {
      each.classList[type]("hover");
    });
  }

  onMouseOver = e => {
    this.hoverClass(e, "add");
  };

  onMouseOut = e => {
    this.hoverClass(e, "remove");
  };

  scrollHandle = () => {
    const { current } = this.$tbody;
    if (!current) {
      return;
    }
    // this.setScrollIng()
    const { top } = current.getBoundingClientRect();
    this.setState({
      top: top < 0 ? Math.min(-top, this.maxTop) : 0
    });
  };

  addEffect() {
    window.addEventListener("scroll", this.scrollHandle, {
      passive: true
    });
    window.addEventListener("resize", this.scrollHandle, {
      passive: true
    });
  }
  removeEffect() {
    window.removeEventListener("scroll", this.scrollHandle);
    window.removeEventListener("resize", this.scrollHandle);
  }

  getHeight() {
    const { current } = this.$tbody;
    if (!current) return;
    const thead = current.querySelector("thead tr");
    const { height } = current.getBoundingClientRect();
    if (thead) {
      this.maxTop = height - thead.clientHeight;
    }
    if (!this.props.multiLine) {
      return;
    }
    this.setState({
      rowsHeight: Array.from(current.querySelectorAll("tbody tr")).map(
        each => each.offsetHeight
      )
    });
  }
  componentDidMount() {
    this.addEffect();
    this.getHeight();
  }

  componentDidUpdate(prevProp, prevState, snap) {
    if (prevProp !== this.props) {
      this.getHeight();
    }
  }

  componentWillUnmount() {
    this.removeEffect();
  }
  render() {
    const {
      dataSource,
      rowKey,
      className,
      scrollBarOffset,
      onRow,
      multiLine
    } = this.props;
    const { left, body, right } = this.formatData;
    const commonProp = {
      dataSource,
      top: this.state.top,
      rowKey,
      onRow,
      multiLine
    };
    return (
      <>
        <div
          className={classnames("fixed-table-container", className)}
          ref={this.content}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          <ScrollBar className="flex-grow" offsetBottom={scrollBarOffset}>
            <BaseTable
              // style={this.tableContentStyle}
              getRef={this.$tbody}
              columns={body}
              {...commonProp}
            />
          </ScrollBar>
          {this.fixedLeft && (
            <BaseTable
              // getRef={this.$left}
              className="fixed-table_fixed fixed-table_fixed-left"
              columns={left}
              {...commonProp}
            />
          )}
          {this.fixedRight && (
            <BaseTable
              // getRef={this.$right}
              className="fixed-table_fixed fixed-table_fixed-right"
              columns={right}
              {...commonProp}
            />
          )}
        </div>
        {
          // it is a magic code
          // i don't know why
          // just use a lower zIndex dom, but it must be outside of table dom
          // fixed thead shake in Chrome when scroll outside table
        }
        <div id="fixed-table-magic" style={{ zIndex: 1, position: "fixed" }} />
      </>
    );
  }
}

export { BaseTable, Table };
