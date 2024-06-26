import { Component } from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { throttle } from 'lodash';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

import withAuth from '../../lib/withAuth';
import { getChapterDetailApiMethod } from '../../lib/api/public';
import Header from '../../components/Header';
import BuyButton from '../../components/customer/BuyButton';
import notify from '../../lib/notify';

const styleIcon = {
  opacity: '0.75',
  fontSize: '24px',
  cursor: 'pointer',
};

const propTypes = {
  chapter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    htmlContent: PropTypes.string,
  }),
  router: PropTypes.shape({
    asPath: PropTypes.string.isRequired,
  }).isRequired,
};

const defaultProps = {
  chapter: null,
};

class ReadChapter extends Component {
  constructor(props, ...args) {
    super(props, ...args);

    const { chapter } = props;

    let htmlContent = '';
    if (chapter && (chapter.isFree || chapter.isPurchased)) {
      htmlContent = chapter.htmlContent;
    } else {      
      htmlContent = chapter.htmlExcerpt;
    }

    this.state = {
      isMobile: false,
      showTOC: false,  
      hideHeader: false,
      chapter,
      htmlContent,
    };
  }

  componentDidMount() {
    document.getElementById('main-content').addEventListener('scroll', this.onScroll);

    const isMobile = window.innerWidth < 768
    if (this.state.isMobile !== isMobile) {
      this.setState({ isMobile }); // eslint-disable-line
    }

    if (this.props.checkoutCanceled) {
      notify('Checkout canceled.');
    }

    if (this.props.error) {
      notify(this.props.error);
    }
  }

  componentWillUnmount() {
    document.getElementById('main-content').removeEventListener('scroll', this.onScroll);
  }

  onScroll = throttle(() => {
    this.onScrollActiveSection()
    this.onScrollHideHeader()
  }, 500)

  onScrollActiveSection = () => {
    const sectionElms = document.querySelectorAll('span.section-anchor');
    let activeSection;
    let aboveSection;

    for (let i = 0; i < sectionElms.length; i += 1) {
      const s = sectionElms[i];
      const b = s.getBoundingClientRect();
      const anchorBottom = b.bottom;

      if (anchorBottom >= 0 && anchorBottom <= window.innerHeight) {
        activeSection = {
          hash: s.attributes.getNamedItem('name').value,
        };

        break;
      }

      if (anchorBottom > window.innerHeight && i > 0) {
        if (aboveSection.bottom <= 0) {
          activeSection = {
            hash: sectionElms[i - 1].attributes.getNamedItem('name').value,
          };
          break;
        }
      } else if (i + 1 === sectionElms.length) {
        activeSection = {
          hash: s.attributes.getNamedItem('name').value,
        };
      }

      aboveSection = b;
    }

    if (this.state.activeSection !== activeSection) {
      this.setState({ activeSection });
    }
  };

  onScrollHideHeader = () => {
    const distanceFromTop = document.getElementById('main-content').scrollTop;
    const hideHeader = distanceFromTop > 500;

    if (this.state.hideHeader !== hideHeader) {
      this.setState({ hideHeader });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chapter && prevProps.chapter._id !== this.props.chapter._id) {
      document.getElementById('chapter-content').scrollIntoView();

      let htmlContent = '';
      if (prevProps.chapter && (prevProps.chapter.isPurchased || prevProps.chapter.isFree)) {
        htmlContent = this.props.chapter.htmlContent;
      } else {
        htmlContent = this.props.chapter.htmlExcerpt;
      }

      // eslint-disable-next-line
      this.setState({ chapter: this.props.chapter, htmlContent });
    }
  }

  static async getInitialProps(ctx) {
    const { 
      bookSlug, chapterSlug, buy, checkout_canceled, error,
    } = ctx.query;
    const { req } = ctx;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetailApiMethod({ bookSlug, chapterSlug }, { headers });

    const redirectToCheckout = !!buy;

    return { 
      chapter, 
      redirectToCheckout, 
      checkoutCanceled: !!checkout_canceled, 
      error,
    };
  }

  toggleChapterList = () => {
    this.setState((prevState) => ({ showTOC: !prevState.showTOC }));
  };

  renderMainContent() {
    const { user, redirectToCheckout } = this.props;
    const { 
      isMobile,
      showTOC,
      chapter, 
      htmlContent,
    } = this.state;
    const { book } = chapter;

    if (user && user._id) {
      user._id = user._id.toString();
    }

    let padding = '20px 20%';
    if (!isMobile && showTOC) {
      padding = '20px 10%';
    } else if (isMobile) {
      padding = '0px 10px';
    }

    return (
      <div style={{ padding }} id="chapter-content">
        <h2 style={{ fontWeight: '400', lineHeight: '1.5em' }}>
          {chapter.order > 1 ? `Chapter ${chapter.order - 1}: ` : null}
          {chapter.title}
        </h2>

        {!chapter.isPurchased && !chapter.isFree ? (
          <BuyButton user={user} book={book} redirectToCheckout={redirectToCheckout} />
        ) : null}
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {!chapter.isPurchased && !chapter.isFree ? (
          <BuyButton user={user} book={book} redirectToCheckout={redirectToCheckout} />
        ) : null}
      </div>
    );
  }

  closeTocWhenMobile = () => {
    this.setState((prevState) => ({ showTOC: !prevState.isMobile }))
  };

  renderSidebar() {
    const { 
      isMobile, showTOC, hideHeader, chapter,
    } = this.state;
    const { book } = chapter;
    const { chapters } = book;

    if (!showTOC) {
      return null;
    }

    return (
      <div
        style={{
          textAlign: 'left',
          position: 'absolute',
          bottom: 0,
          left: 0,
          top: hideHeader ? 0 : '64px',
          transition: 'top 0.5s ease-in',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: isMobile ? '100%' : '400px',
          padding: '0px 25px',
        }}
      >
        <p style={{ padding: '0px 40px', fontSize: '17px', fontWeight: '400' }}>{book.name}</p>
        <ol start="0" style={{ padding: '0 25', fontSize: '14px', fontWeight: '300' }}>
          {chapters.map((ch, i) => (
            <li 
              key={ch._id} 
              role='presentation'
              style={{ listStyle: i === 0 ? 'none' : 'decimal', paddingBottom: '10px' }}
            >
              <Link
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
                onClick={this.closeTocWhenMobile}
              >
                {ch.title}
              </Link>
              {chapter._id === ch._id ? this.renderSections() : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  renderSections() {
    const { chapter } = this.state;
    const { activeSection } = this.state;
    const { sections } = chapter;

    if (!sections || !sections.length === 0) {
      return null;
    }

    return (
      <ul>
        {sections.map((s) => (
          <li key={s.escapedText} style={{ paddingTop: '10px' }}>
            <a 
              href={`#${s.escapedText}`} 
              style={{
                color: activeSection && activeSection.hash === s.escapedText ? '#1565C0' : '#222',
              }}
              onClick={this.closeTocWhenMobile}
            >
              {s.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { user, router } = this.props;
    const {
      isMobile,
      chapter, 
      showTOC,
      hideHeader,
    } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    let left = '20px';
    if (showTOC) {
      left = isMobile ? '100%' : '400px';
    }

    return (
      <div style={{ overflowScrolling: 'touch', WebkitOverflowScrolling: 'touch' }}>
        <Head>
          <title>
            {chapter.title === 'Introduction'
              ? 'Introduction'
              : `Chapter ${chapter.order - 1}. ${chapter.title}`}
          </title>
          {chapter.seoDescription ? (
            <meta name="description" content={chapter.seoDescription} />
          ) : null}
        </Head>

        <Header user={user} hideHeader={hideHeader} redirectUrl={router.asPath}/>

        {this.renderSidebar()}

        <div
          style={{
            textAlign: 'left',
            padding: '0px 10px 20px 30px',
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: hideHeader ? 0 : '64px',
            left,
            transition: 'top 0.5s ease-in',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          id="main-content"
        >
          <div
            style={{
              position: 'fixed',
              top: '80px',
              left: '15px',
            }}
          />
          {this.renderMainContent()}
        </div>
        <div
          style={{
            position: 'fixed',
            //top: hideHeader ? '20px' : '80px',
            transition: 'top 0.5s ease-in',
            left: '15px',
          }}
        >
          <FormatListBulletedIcon
            style={styleIcon}
            onClick={this.toggleChapterList}
          />
        </div>
      </div>
    );
  }
}

ReadChapter.propTypes = propTypes;
ReadChapter.defaultProps = defaultProps;

export default withAuth(withRouter(ReadChapter), { 
  loginRequired: false,
});