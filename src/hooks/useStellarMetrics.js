import { useState, useEffect } from "react";

const useStellarMetrics = (setllarConnection) => {
  const [blockIndex, setBlockIndex] = useState(0);
  const [transactionsPerSecond, setTransactionsPerSecond] = useState(0);

  let eventSource;

  useEffect(() => {
    // Get the block index of the most recent block
    setllarConnection
      .ledgers()
      .order("desc")
      .limit(1)
      .call()
      .then((response) => {
        setBlockIndex(response.records[0].sequence);
      })
      .catch((error) => {
        console.error(error);
      });

    // Listen for new transactions and calculate the throughput
    let transactionCount = 0;
    let startTime = Date.now();
    const transactionHandler = () => {
      transactionCount++;
      const elapsedTime = (Date.now() - startTime) / 1000;
      const fixedTransaction = transactionCount / elapsedTime;
      setTransactionsPerSecond(fixedTransaction);
    };
    eventSource = setllarConnection
      .transactions()
      .cursor("now")
      .stream({ onmessage: transactionHandler });
    // Clean up the event listener on unmount
    return () => {
      eventSource.onmessage = null;
    };
  }, []);

  return { blockIndex, transactionsPerSecond };
};

export default useStellarMetrics;
