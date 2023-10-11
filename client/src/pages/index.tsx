// importing google font for NextJS
import { getJSONData } from '@/tools/Toolkit';
import { Griffy } from 'next/font/google';
const griffy = Griffy({weight: "400", subsets: ['latin']});
import { Orders } from '@/tools/orders.model';
import { useState, useEffect } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function Home() {
  // retrieve server sided script
  const RETRIEVE_SCRIPT:string = "https://www.seanmorrow.ca/_lessons/retrieveOrder.php";

  // ----------------------------state variables
  
  // setting the initial state of the orders to null, until it receives the actual data
  const [orders, setOrders] = useState<Orders | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //----------------------------- event handlers
  // handle successful retrieval of data
  const onResponse = (data:Orders) => {
    setOrders(data);
    setIsLoading(false);
    
  };

  const onError = (message:string) => {
    console.log(`*** Error retrieving pizza order data: :( | + ${message}`);
    setIsLoading(false);
  }

  // retrieve the API
  const getOrders = (e:any) => {
    setIsLoading(true);
    // fetch the data from the api
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);
  };

  // ---------------------------- rendering to DOM
  return (
    <main className="grid grid-rows-1 grid-cols-1 gap-0 text-content">

      <div className="flex flex-nowrap items-center justify-center 
          bg-accent bg-[url('./../lib/images/background.jpg')] bg-no-repeat bg-center bg-cover
          border-solid border-b-4 border-accent min-h-[220px] p-5 text-white">

        <header className="grow text-center md:text-left">
          <div className={`${griffy.className} text-6xl`}>Antonio's Online Pizzaria</div>
          <div className="text-sm">If it's not Antonio's, it's rubbish!</div>
        </header>

        <div className="shrink-0 hidden md:block">
          <i className="fab fa-facebook-square fa-2x ml-1"></i>
          <i className="fab fa-twitter-square fa-2x ml-1"></i>
          <i className="fab fa-instagram fa-2x ml-1"></i>
        </div>
      </div>

      <aside className="flex flex-nowrap items-center justify-between p-5 flex-col md:flex-row">
        <div className="mb-5 md:hidden text-center">
          <>1234 Cheesy Drive | Tastyville, NS | 902-123-4567</>
        </div>
        <div>
          <div className="text-accent text-3xl font-bold mb-2.5">Welcome loyal pizza dispatcher....</div>Click the &quot;Get Orders&quot; button below to view all current orders that need to be delivered.
          <div>
              <button 
                className="bg-accent border-none rounded-md p-2.5 text-white hover:bg-greyContent mt-5" onClick={getOrders}>Get Orders</button>
          </div>
        </div>
        <div className="shrink-0 text-lg text-right text-greyContent hidden md:block">
          <div>Antonio's Pizzaria</div>
          <div>1234 Cheesy Drive</div>
          <div>Tastyville, NS</div>
          <div>902-123-4567</div>
        </div>
      </aside>

      <div className="bg-greyAccent p-7">

        <div id="output" className="divide-dashed divide-y-2 divide-accent ml-2">
          {/* using terinary operator to display orders or not, if there is data, it will display it by mapping through each order in the array */}
          {orders ? (
          orders.orders.map((order) => (
            <div key={order.id} className="p-3 mb-3">
              <h2 className="font-bold text-2xl text-red-700 pb-2">Order #{order.id}: </h2>
              <div className="font-bold pt-1"><i className="fa-solid fa-circle-info pr-1"></i>Customer Information: </div>
                <div>{order.name}</div>
                <div>{order.address}</div>
                <div>{order.city}</div>
              <div className="font-bold pt-1"><i className="fa-solid fa-pizza-slice pr-1"></i>Pizza Size:</div>
                <div> {order.size}</div>
              <div>
                <div className="font-bold pt-1"> <i className="fa-solid fa-list pr-1"></i>Order Details: </div>
                <ul>
                  {order.toppings.map((topping, idx) => (
                    <li key={idx}>{topping.topping}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-bold pt-1"><i className="fa-solid fa-note-sticky pr-1"></i> Order Notes: </div>
                <ul>
                  {order.notes.map((note, idx) => (
                    <li key={idx}>{note.note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <>No orders retrieved...</>
        )}
        {/* Keeping the loading overlay local only to this page */}
          {isLoading && 
        <LoadingOverlay 
          enabled={true} 
          bgColor="rgba(0,0,0,0.5)" 
          showSpinner={true} 
          spinnerColor="red" 
        />
      }

        </div>
      </div>
    </main>
  );

};