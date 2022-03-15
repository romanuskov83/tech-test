
import React, {useEffect, useRef, useState} from 'react';
import './index.css';

interface AutoCompleteListItemProps {
    value: string,
    highlighted: string,
    selected: boolean,
    onClick: () => void
}

const AutoCompleteListItem = (props : AutoCompleteListItemProps) => {

    const highlightAt = props.value.toLowerCase().indexOf(props.highlighted.toLowerCase())


    return (
        //TODO: use pseudo class. which one?
        <li className={"component-list-item" + (props.selected ? " component-list-item-selected" : "")} onMouseDown={props.onClick}>
            {props.value.substring(0,highlightAt)}<b>{props.value.substring(highlightAt,highlightAt+props.highlighted.length)}</b>{props.value.substring(highlightAt+ props.highlighted.length)}
        </li>
    )
}

interface AutoCompleteProps {
    fetch : (query: string) => Promise<string[]>
}

const AutoComplete = (props: AutoCompleteProps) => {

    const fetch = props.fetch

    //Indicates if popup was canceled by:
    // - ESC
    // - item selection
    // - scroll out of visibility
    // - focus loss
    const [popupCanceled, setPopupCanceled] = useState(false)

    //Indicates if popup should be displayed above input
    const [popupTop, setPopupTop] = useState(true)

    //Maximum elements in list
    const [maxElements,setMaxElements] = useState(-1)

    //Current query
    const [query, setQuery] = useState("")
    //Choices received
    const [choices, setChoices] = useState<string[]>([])
    //List item that is currently selected (with arrows)
    const [currentChoice, setCurrentChoice] = useState(-1)

    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleSpaceChanged = () => {
            if(inputRef.current) {
                const spaceAvailableTop = inputRef.current.getBoundingClientRect().y
                const spaceAvailableBottom = window.innerHeight - (inputRef.current.getBoundingClientRect().y + inputRef.current.getBoundingClientRect().height)

                if(spaceAvailableTop < 0 || spaceAvailableBottom < 0) {
                    setPopupCanceled(true)
                    return
                }

                if(choices.length === 0 || popupCanceled) {
                    //show popup in an area with maximum free space
                    setPopupTop(spaceAvailableTop > spaceAvailableBottom)
                } else if(popupRef.current) {
                    const popupHeight = popupRef.current.clientHeight

                    //if there is not enough space for popup and there is more space on the opposite side => switch side
                    if(popupTop && spaceAvailableTop < popupHeight && spaceAvailableBottom > spaceAvailableTop) {
                        setPopupTop(false)
                    } else if(!popupTop && spaceAvailableBottom < popupHeight && spaceAvailableTop > spaceAvailableBottom) {
                        setPopupTop(true)
                    }
                }

            }
        }

        handleSpaceChanged()
        window.addEventListener('resize', handleSpaceChanged)
        window.addEventListener('scroll', handleSpaceChanged)
        return () => {
            window.removeEventListener('resize', handleSpaceChanged)
            window.removeEventListener('scroll', handleSpaceChanged)
        }
    },[choices,popupCanceled,popupTop,maxElements])



    useEffect(()=>{
        if(!inputRef.current)
            return;
        let canceled = false;
        const s = query
        const spaceAvailableTop = inputRef.current.getBoundingClientRect().y
        const spaceAvailableBottom = window.innerHeight - (inputRef.current.getBoundingClientRect().y + inputRef.current.getBoundingClientRect().height)

        setCurrentChoice(-1)
        //TODO: hardcoded 40 is not good at all
        setMaxElements(Math.floor(0.8 * Math.max(spaceAvailableBottom, spaceAvailableTop) / 40))
        setPopupCanceled(false)
        setChoices([])
        setQuery(s)
        if (s.length > 0) {
            fetch(s).then(choices => {
                if (!canceled) {
                    setChoices(choices)
                }
            })
        }
        return () => {canceled = true}
    },[query,fetch])

    const handleQueryChange = (s: string) => {
        setQuery(s)
    }

    const popupShown = () : boolean => {
        return choices.length > 0 && !popupCanceled
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if((e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Escape" || e.key === "Enter") && popupShown()) {
            e.preventDefault()
            if(e.key === "Escape") {
                setPopupCanceled(true)
            } else if(e.key === "ArrowUp") {
                if(currentChoice === -1 || currentChoice === 0) {
                    setCurrentChoice(Math.min(choices.length-1,maxElements-1))
                } else {
                    setCurrentChoice(currentChoice-1)
                }
            } else if(e.key === "ArrowDown") {
                if(currentChoice === -1 || currentChoice === Math.min(choices.length-1,maxElements-1)) {
                    setCurrentChoice(0)
                } else {
                    setCurrentChoice(currentChoice+1)
                }
            } else if(e.key === "Enter") {
                if(currentChoice !== -1) {
                    setQuery(choices[currentChoice]);
                    setTimeout(() =>setPopupCanceled(true))
                }
            }
        }
    }

    const popupStyle = { visibility: (popupShown() ? "visible" : "hidden"), ...(popupTop ? {bottom: "105%"} : {top: "105%"})} as const;


    const items = choices.slice(0,Math.min(choices.length,maxElements)).map((value, index) => (
        <AutoCompleteListItem
            value={value}
            highlighted={query}
            key={index}
            onClick={() => {
                handleQueryChange(value);
                setTimeout(() =>inputRef.current?.focus())
            }}
            selected={index===currentChoice}/>
    ))

    return (
        <div className="component-container">
            <input ref={inputRef} className="component-input" value={query}
                   onChange={(e) => handleQueryChange(e.target.value)}
                   onBlur={() => setPopupCanceled(true)}
                   onKeyDown={handleKeyDown}/>
            <div ref={popupRef} className="component-popup" style={popupStyle}>
                <ul>
                    {items}
                </ul>
            </div>
        </div>
    )
}

export default AutoComplete;