import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from './api/fetchImages';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import React from 'react';

export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    currentSearch: '',
    pageNr: 1,
    modalOpen: false,
    modalImg: '',
    modalAlt: '',
    totalHits: 0,
  }};

  handleSubmit =  e => {
    e.preventDefault();
    this.setState({ 
      currentSearch: e.target.elements.inputForSearch.value,
      images: [],
      isLoading: false,
      pageNr: 1,
      modalopen: false,
      modalImg: '',
      modalAlt: '',
      totalHits: 0,
    });
  };

  handleClickMore =  () => {
    this.setState(prev => ({
      pageNr: prev.pageNr + 1,
    }));
    async componentDidUpdate(prevProps, prevState) {
      const {currentSearch, pageNr} = this.state;
      if (
        prevState.currentSearch !== currentSearch || 
        prevState.pageNr !== pageNr
      ) {
        this.setState({isLoading: true });
        try {
          const {hits, totalHits} = await fetchImages (
            this.state.currentSearch,
            this.state.pageNr
          );
          this.setState(prev => ({
            images: [...prev.images, ...hits],
            totalHits: totalHits,
          }));
        } catch (error) {
          console.log(error);
        } finally {
          this.setState({ isLoading: false});
        }
      }
    }

  handleImageClick = e => {
    this.setState({
      modalOpen: true,
      modalAlt: e.target.alt,
      modalImg: e.target.name,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
      modalImg: '',
      modalAlt: '',
    });
  };

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.handleModalClose();
    }
  };

  async componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
        }}
      >
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <Searchbar onSubmit={this.handleSubmit} />
            <ImageGallery
              onImageClick={this.handleImageClick}
              images={this.state.images}
            />
            {this.state.images.length > 0 &&
            this.state.images.length < this.state.totalHits && (
              <Button onClick={this.handleClickMore} />
            )}
          </React.Fragment>
        )}
        {this.state.modalOpen ? (
          <Modal
            src={this.state.modalImg}
            alt={this.state.modalAlt}
            handleClose={this.handleModalClose}
          />
        ) : null}
      </div>
    );
  }
}