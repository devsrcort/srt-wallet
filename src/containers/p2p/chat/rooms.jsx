import React from 'react'
import PropTypes from 'prop-types'
import style from './style.css'

//UTILS
import i18n from "./../../../utils/i18n.js"
import { convertISO8601 } from "./../../../utils/numbers.js"
import { getUserId } from "./../../../utils/localStorage.js"

//REDUX
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { chatDetailsSetter } from "./../redux/p2pAction"

//GLOBAL COMPONENTS
import Loading from "./../../../components/loading.jsx"

//FUNCTIONS
import { getChatBundle } from "./functions"

class Rooms extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.sellerId = getUserId()
  }

  loading = (loading) => this.setState({loading})

  handleJoinRoom = (room) => {
    this.loading(true)

    const { chatDetailsSetter, chatDetails } = this.props
    chatDetailsSetter({
      buyer: room,
      currentRoom: room.roomHashId
    })
    let { seller, currentOrder } = chatDetails
    let { id: adOwnerId } = seller
    let { id: adId } = currentOrder
    getChatBundle({adOwnerId, buyerId: room.userId, adId})
  }

  loadRender = () => {
    // return <p className={style.defaultWhiteText}>{i18n.t("P2P_CHAT_ROOM_LOADING")}</p>
    return <Loading/>
  }

  emptyRender = () => {
    return <p className={style.defaultWhiteText}>{i18n.t("P2P_CHAT_NOBODY_WAS_INSTERESTED_YET")}</p>
  }
  //remove seller from the rooms
  removeMySelf = (room) => {
    if (!room) return false;
    if (room.userId == this.sellerId) return false;
    return true;
  }
  convertData = (room) => {
    room.lastMessage = convertISO8601(room.lastMessage)
    room.lastMessage = room.lastMessage ? room.lastMessage.hour : '??:??'
    return room;
  }
  enterInTheFirstChat = (room) => {
    this.handleJoinRoom(room)
  }
  componentDidMount() {
    let { rooms } = this.props
    rooms = rooms.filter(this.removeMySelf)
    if (rooms.length === 1) this.handleJoinRoom(rooms[0])
  }
  render() {
    let { rooms } = this.props

    if (this.state.loading) return this.loadRender()
    if (!rooms || (rooms && rooms.length < 1)) return this.emptyRender()

    return(
      <div className={style.roomsWrapper}>
        {rooms.filter(this.removeMySelf).map(this.convertData).map((room, key) => {
          return (
            <div className={style.room} key={key} onClick={() => { this.handleJoinRoom(room) }}>
              <div className={style.imageWrapper}>
                <img src={room.profilePicture || room.photo || "images/lunio/lunio-user@100x100.jpg"}/>
              </div>
              <div className={style.messageWrapper}>
                <div className={style.name}>{room.name}</div>
                <div className={style.message}>{i18n.t("P2P_CHAT_STATIC_BUYER_MESSAGE")}</div>
              </div>
              <div className={style.timeWrapper}>
                <div className={style.time}>{room.lastMessage}</div>
              </div>
            </div>
            )
        })}
      </div>
    )
  }
}

Rooms.propTypes = {
  rooms: PropTypes.array.isRequired,
  chatDetailsSetter: PropTypes.func.isRequired,
  chatDetails: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  chatDetails: state.p2p.chatDetails
})
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    chatDetailsSetter
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Rooms)
