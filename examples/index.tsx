import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-coy.css';
import 'antd/dist/antd.css';
import './index.scss';

import fs from 'fs';
import Basic from './Basic';
import Dynamic from './Dynamic';

const BasicCode = fs.readFileSync(__dirname + '/Basic.tsx', 'utf8');
const DynamicCode = fs.readFileSync(__dirname + '/Dynamic.tsx', 'utf8');

interface IDemoProps {
  code: string;
  title: string;
  description?: string;
}

interface IDemoState {
  codeVisible: boolean;
}

class Demo extends React.Component<IDemoProps, IDemoState> {
  state = {
    codeVisible: false
  };

  handleExpand = () => {
    this.setState((prevState) => ({
      codeVisible: !prevState.codeVisible
    }));
  };
  public render() {
    const { children, code, title, description } = this.props;
    const { codeVisible } = this.state;
    return (
      <>
        <h3 className="demo-title">{title}</h3>
        {description && <p>{description}</p>}
        <section className="demo-section">
          <div className="source">{children}</div>
          <div className="code" style={{ display: codeVisible ? 'block' : 'none' }}>
            <pre className="language-tsx">
              <code>{code}</code>
            </pre>
          </div>
          <div className="code-control" onClick={this.handleExpand}>
            <img
              alt="show code"
              className="icon-expand"
              src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
            />
            <img
              alt="hide code"
              className="icon-expand"
              style={{ display: codeVisible ? 'block' : 'none' }}
              src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
            />
          </div>
        </section>
      </>
    );
  }
}

class App extends React.Component<{}, any> {
  componentDidMount() {
    Prism.highlightAll();
  }
  public render() {
    return (
      <div className="container">
        <Demo code={BasicCode} title="Basic">
          <Basic />
        </Demo>
        <Demo code={DynamicCode} title="Dynamic">
          <Dynamic />
        </Demo>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
