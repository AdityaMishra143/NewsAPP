import React, { Component } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  capitalizeFirstLetter=(String)=> {
    return String.charAt(0).toUpperCase() + String.slice(1);
}
  constructor(props) {
    super(props);
    //console.log("Hello I'm a constructor from news component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title = `Newsonkey - ${this.capitalizeFirstLetter(this.props.category)}`;
  }

  async updateNews() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=${this.props.category}&apiKey=13e20e39f9334818b27bdbab5dc867ca&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
   // let url = `https://newsapi.org/v2/top-headlines?country=us&category=${
   //   this.props.category
   // }&apiKey=13e20e39f9334818b27bdbab5dc867ca&page=${
   //   this.state.page - 1
   // }&pageSize=${this.props.pageSize}`;
   // this.setState({ loading: true });
   // let data = await fetch(url);
   // let parsedData = await data.json();
   // console.log(parsedData);
   // this.setState({
   //   page: this.state.page - 1,
   //   articles: parsedData.articles,
   //   loading: false,
   // });
   this.setState({page:this.state.page - 1});
   this.updateNews();
  };
  handleNextClick = async () => {
   // if (
   //   !(
   //     this.state.page + 1 >
   //     Math.ceil(this.state.totalResults / this.props.pageSize)
   //   )
   // ) {
   //   let url = `https://newsapi.org/v2/top-headlines?country=us&category=${
   //     this.props.category
   //   }&apiKey=13e20e39f9334818b27bdbab5dc867ca&page=${
   //     this.state.page + 1
   //   }&pageSize=${this.props.pageSize}`;
   //   this.setState({ loading: true });
   //   let data = await fetch(url);
   //   let parsedData = await data.json();
   //   console.log(parsedData);
   //   this.setState({
   //     page: this.state.page + 1,
   //     articles: parsedData.articles,
   //     loading: false,
   //   });
   // }
   this.setState({page:this.state.page + 1});
   this.updateNews();
  };

  render() {
    //    console.log("render")
    return (
      <div className="container my-3">
        <h2 className="text-center">NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.id}>
                  <Newsitem
                    title={element.title ? element.title.slice(0, 71) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 58)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
