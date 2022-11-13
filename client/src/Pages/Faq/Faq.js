import React from 'react'
import image1 from '../../assets/unnamed.png'
import image2 from '../../assets/unnamed (1).png'
import image3 from '../../assets/unnamed (2).png'
import image4 from '../../assets/unnamed (3).png'
import "./Faq.css"
import { Collapse } from 'antd'

const { Panel } = Collapse;


const Faq = () => {
    return (
        <div className='faq'>
            <div>
                <div className="inner">
                    <h2 className='title'>Frequenty Asked Questions</h2>
                    <div className="question-container">
                        <Collapse defaultActiveKey={['1']}>
                            <Panel header="How does Nookmall work?" key="1">
                                <ol>
                                    <li>Add to cart : Add item(s) to your cart and place the order.</li>
                                    <li>
                                        Message us! : Click the chat icon on the lower right corner of the page and provide us your order number and Dodo Code™
                                        *Dodo Code™ will be provided through our Live Chat after you provide us your order number!
                                    </li>
                                    <li>Delivery : The delivery staff will arrive on your island within 5-10 minutes!</li>
                                </ol>
                            </Panel>
                            <Panel header="Where can I find my order number?" key="2">
                                Your order number can be found on your account page.
                            </Panel>
                            <Panel header="Where can I get my Dodo Code?" key="3">
                                Go to your airport and speak with Orville. Select the following dialogue prompts:
                                <br />
                                "I want visitors"
                                <br />
                                "Via online play"
                                <br />
                                "Roger!"
                                <br />
                                "Invite via Dodo Code™"
                                <br />
                                "The more the merrier!"
                                <br />
                                "Yeah, invite anyone"
                                <br />
                                You will receive a 5 characters Dodo Code™
                            </Panel>
                            <Panel header="How does villager order work?" key="4">
                                <div>
                                    1. You need to have at least 6 villagers on your island and have an open plot on your island (Not in boxes) for the new villager to move in.
                                    <br />
                                    <img src={image1} alt="faq" className='w-100 p-5' />
                                    <br />
                                    If you don't have an open plot and need to kick a villager out.
                                    💚Here is a guide how you kick a villager out: <a href='https://game8.co/games/Animal-Crossing-New-Horizons/archives/285170#hl_1'>Villager Kick Out Guide</a>
                                    <br />
                                    2. Purchase the villager you want and message us your order number through our LiveChat.. The Dodo code will be provided within 5-15 mins.
                                    <br />
                                    3. Fly to our island and follow our staff to the villager's home. Go in and invite the villager to move to your island.
                                    <br />
                                    Go to your airport and speak with Orville. Select the following dialogue prompts:
                                    <br />
                                    “I wanna fly!”
                                    <br />
                                    “I wanna visit someone”
                                    <br />
                                    “Via online play”
                                    <br />
                                    “Search via Dodo Code™”
                                    <br />
                                    Insert the Dodo Code that is given by our staff on the Live chat!
                                </div>
                            </Panel>
                            <Panel header="How do Island Visits work?" key="5">
                                <div>
                                    1. Purchase the island visit through the site.
                                    <br />
                                    2. Be sure to have time before messaging us your order number through our LiveChat. (If you don't have time yet, don't worry! You can message us your order number anytime)
                                    <br />
                                    3. The instructions of the island and Dodo Code™ will be provided within 5-10 mins once you message us your order number through our Live Chat. Make sure to read the instructions before you fly over.
                                    <br />
                                    Go to your airport and speak with Orville. Select the following dialogue prompts:
                                    <br />
                                    2. Purchase the villager you want and message us your order number through our LiveChat.. The Dodo code will be provided within 5-15 mins.
                                    <br />
                                    3. Fly to our island and follow our staff to the villager's home. Go in and invite the villager to move to your island.
                                    <br />
                                    Go to your airport and speak with Orville. Select the following dialogue prompts:
                                    <br />
                                    “I wanna fly!”
                                    <br />
                                    “I wanna visit someone”
                                    <br />
                                    “Via online play”
                                    <br />
                                    “Search via Dodo Code™”
                                    <br />
                                    Insert the Dodo Code that is given by our staff on the Live chat!
                                </div>
                            </Panel>
                            <Panel header="Why do I receive Gold Nuggets or Royal Crowns when I order Bells?" key="6">
                                <div>
                                    In order to save time during the delivery process we deliver gold nuggets or royal crowns instead of bells. Please ensure to sell the gold nuggets/royal crowns directly to Timmy or Tommy INSIDE the Nooks Cranny store for bells 🤓 1 stack of gold nuggets/royal crown = 300,000 bells 🙂
                                    <br />
                                    <br />
                                    ❌DO NOT sell outside Drop-Off Box!❌
                                    <br />
                                    <br />
                                    The Drop-Off Box pays 80% of an item's normal value, deducting 20% in fees.*
                                    <br />
                                </div>
                            </Panel>
                            <Panel header="How to Search and Save Custom Designs that are provided in the room design description? " key="7">
                                <div>
                                    1. Access the Custom Designs Poral In Able Sisters tailor shop
                                    <br />
                                    <img src={image2} alt="faq" className='w-100 p-5' />
                                    <br />
                                    2. Search by Creator ID or the Design ID and insert the code that is provided in the room design description.
                                    <br />
                                    <img src={image3} alt="faq" className='w-100 p-5' />
                                    <br />
                                    3. Save the designs and over-write on your empty Design Patterns.
                                    <br />
                                    <img src={image4} alt="faq" className='w-100 p-5' />
                                    <br />
                                    Here are steps to customize items with custom Designs:
                                    <br />
                                    <a href='https://game8.co/games/Animal-Crossing-New-Horizons/archives/286687'>How to customize items</a>
                                    <br />
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faq
