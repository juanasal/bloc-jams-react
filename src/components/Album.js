import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: "",
      currentTime: 0,
      currentVolume: 1,
      duration: album.songs[0].duration,
      isPlaying: false,
      isMouseInside: false,
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ currentVolume: this.audioElement.volume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  handleIconToggle(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isMouseInside === index + 1 && !this.state.isPlaying && !isSameSong){
      return <span className="ion-md-play"></span>
    } else if (this.state.isMouseInside === index + 1 && this.state.isPlaying && isSameSong) {
      return <span className="ion-md-pause"></span>
    } else if (isSameSong && this.state.isPlaying){
      return <span className="ion-md-pause"></span>
    } else if (this.state.isMouseInside === index + 1 && this.state.isPlaying && !isSameSong) {
      return <span className="ion-md-play"></span>
    } else if (isSameSong && !this.state.isPlaying){
      return <span className="ion-md-play"></span>
    } else {
      return index + 1;
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const highestIndex = this.state.album.songs.length - 1;
    const newIndex = Math.min(highestIndex, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.currentVolume = newVolume;
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }

  formatTime(e) {
    const a = parseInt(e);
    const minutes = Math.floor(a/60);
    const seconds = Math.floor(a % 60).toFixed();
    const formatedSeconds = "0";
    if (isNaN(minutes) || isNaN(seconds)) {
      return "-:--";
    } else {
      return (minutes + ":" + (seconds.toString().length === 1 ? formatedSeconds : "") + seconds);
    };
  }

  render() {
    return (
      <section className="album container-fluid">
        <div className="row justify-content-sm-center">
          <div className="col">
            <div className="container">
              <div className="row">
                <div className="col">
                  <section id="album-image">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
                  </section>
                </div>
                <div className="col">
                  <section id="album-info">
                    <div className="album-details">
                      <h1 id="album-title">{this.state.album.title}</h1>
                      <h2 className="artist">{this.state.album.artist}</h2>
                      <div id="release-info">{this.state.album.releaseInfo}</div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <table id="song-list">
                    <colgroup>
                      <col id="song-number-column" />
                      <col id="song-title-column" />
                      <col id="song-duration-column" />
                    </colgroup>
                    <tbody>
                      {
                        this.state.album.songs.map( (song, index) =>
                        <tr className="song"
                            key={1+index+"song"}
                            id={1+index+"song"}
                            onClick={() => this.handleSongClick(song)}
                            onMouseEnter={() => this.setState({ isMouseInside: index + 1 })}
                            onMouseLeave={() => this.setState({ isMouseInside: false })}
                        >
                          <td className="song-number">
                            {this.handleIconToggle(song, index)}
                          </td>
                          <td className="song-title">{song.title}</td>
                          <td className="song-duration">{this.formatTime(song.duration)}</td>
                        </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
                <div className="col">
                  <PlayerBar
                    className="player-bar"
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    currentVolume={this.audioElement.currentVolume}
                    duration={this.audioElement.duration}
                    formatTime={(e) => this.formatTime(e)}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolumeChange={(e) => this.handleVolumeChange(e)}
                  />
                </div>
              </div>
            </div>

        </div>
      </div>
      </section>
    );
  }
}

export default Album;
