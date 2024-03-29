import React, { Component } from 'react';

class PlayerBar extends Component {
  render() {
    return (
      <section className="player-bar">
        <section id="buttons">
          <button id="previous" onClick={this.props.handlePrevClick}>
            <span className="ion-md-skip-backward"></span>
          </button>
          <button id="play-pause" onClick={this.props.handleSongClick}>
            <span className={this.props.isPlaying ? 'ion-md-pause' : 'ion-md-play'}></span>
          </button>
          <button id="next" onClick={this.props.handleNextClick}>
            <span className="ion-md-skip-forward"></span>
          </button>
        </section>
        <section id="time-control">
          <div className="player-time-readout">
            <div className="current-time">{this.props.formatTime(this.props.currentTime)}</div>
            <p className="slash">/</p>
            <div className="total-time">{this.props.formatTime(this.props.duration)}</div>
          </div>
          <input
            type="range"
            className="seek-bar"
            value={(this.props.currentTime / this.props.duration) || 0}
            max="1"
            min="0"
            step="0.01"
            onChange={this.props.handleTimeChange}
          />
        </section>
        <section id="volume-control">
          <input
            type="range"
            className="seek-bar"
            value={(this.props.currentVolume) || 1}
            max="1"
            min="0"
            step="0.1"
            onChange={this.props.handleVolumeChange}
          />
          <div className="volume-low-high">
            <div className="icon ion-md-volume-low"></div>
            <div className="icon ion-md-volume-high"></div>
          </div>
        </section>
      </section>
    );
  }
}

export default PlayerBar;
