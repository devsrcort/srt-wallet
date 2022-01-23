import React from "react";
import PropTypes from "prop-types";

// STYLE
import style from "./style.css";

class MultiSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOpen: false,
            listCoins: [],
        };
    }

    toggleList = () => {
        this.setState(prevState => ({
            listOpen: !prevState.listOpen
        }));
    };

    selectListItem = (value = undefined, title = undefined, img = undefined) => {
        const { selectItems } = this.props;
        const { listCoins } = this.state;
        let found = false;
        listCoins.map(
            (v, key) => {
                if(v!==undefined){
                    if (v.value === value) {
                        found = true;
                        delete listCoins[key];
                    }
                }
            }
        );
        if (!found) {
            if (value !== undefined) {
                this.setState({
                    ...this.state,
                    listCoins:[
                        ...this.state.listCoins,
                        {
                            value, title, img
                        }
                    ]


                })

            }

        }

        selectItems(listCoins);
        this.toggleList();
    };

    renderItems = () => {
        let { list } = this.props;

        const listStyle = {
          width: "148px"
        }

        return (
            <ul className={style.list} style={listStyle}>
                {list.map((item, id) => (
                    <li
                        className={style.listItem}
                        key={id}
                        onClick={() =>
                            this.selectListItem(item.value, item.title, item.img)
                        }
                    >
                        {item.img ? <img src={item.img} alt={item.title} /> : ""}{" "}
                        {item.title}
                    </li>
                ))}
            </ul>
        );
    };

    handleClick = ev => {
        if (this.selectMenu && !this.selectMenu.contains(ev.target)) {
            this.setState({
                ...this.state,
                listOpen: false
            });
        }
    };

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }
    //NAO SEI SE AQUI ERA PRA SER REMOVELISTENER
    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
    }
    renderListCoins = () => {
        const { listCoins } = this.state;
        if (listCoins.length > 0) {
            return (
                <div className={style.title}>
                    {listCoins.map((item, id) => (

                        item!==undefined ? <img key={id} className={style.ico} src={item.img} />:""
                    ))
                    }
                </div>
            );
        } else {
            return this.renderNull();
        }
    }
    renderNull = () =>{
        return (
            <div className={style.title}>
                <div className={style.ico}>
                </div>
                <div className={style.ico}>
                </div>
                <div className={style.ico}>
                </div>
                <div className={style.ico}>
                </div>
                <div className={style.ico}>
                </div>
            </div>
        );
    }
    render() {
        const { width, error, wrapperStyle: tmp } = this.props;
        const { listOpen } = this.state;

        const wrapperStyle = {
            width: width ? width : "50px",
            ...tmp
        };

        return (
            <div
                className={style.wrapper}
                style={wrapperStyle}
                ref={el => (this.selectMenu = el)}
            >
                <div className={style.header} onClick={() => this.toggleList()}>
                    <div className={style.title}>
                        {this.renderListCoins()}
                        <div className={style.icon}>
                            {listOpen ? (
                                <img src="./images/icons/arrow/expand-less@2x.png" />
                            ) : (
                                    <img src="./images/icons/arrow/expand-more@2x.png" />
                                )}
                        </div>
                    </div>
                </div>
                {listOpen && this.renderItems()}
            </div>
        );
    }
}

MultiSelect.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectItems: PropTypes.func.isRequired,
    wrapperStyle: PropTypes.object,
    width: PropTypes.string
};

export default MultiSelect;
