import { Component } from "react";
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';

import { editBookApiMethod, getBookDetailApiMethod } from "../../lib/api/admin";
import notify from "../../lib/notify";
import withAuth from "../../lib/withAuth";
import EditBook from "../../components/EditBook";

const propTypes = {
  slug: PropTypes.string.isRequired,
};

class EditBookPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      book: null,
    };
  }

  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  async componentDidMount() {
    NProgress.start();

    try {
      const { slug } = this.props;
      const book = await getBookDetailApiMethod({ slug });
      this.setState({ book }); // eslint-disable-line
      NProgress.done();
    } catch (err) {
      notify(err.message || err.toString());
      NProgress.done();
    }
  }

  editBookOnSave = async (data) => {
    const { book } = this.state;
    NProgress.start();

    try {
      const editedBook = await editBookApiMethod({ ...data, id: book._id });
      notify('Saved');
      NProgress.done();
      Router.push(
        `/admin/book-detail?slug=${editedBook.slug}`,
        `/admin/book-detail/${editedBook.slug}`,
      );
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  };

  render() {
    const { book } = this.state;

    if (!book) {
      // return <Error statusCode={500} />;
      return null;
    }

    return (
      <div>
        <EditBook onSave={this.editBookOnSave} book={book} />
      </div>
    );
  }
}

EditBookPage.propTypes = propTypes;

export default withAuth(EditBookPage);
