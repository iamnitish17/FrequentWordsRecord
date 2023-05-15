import React, { useState } from 'react';
import { BarChart,Tooltip, Legend, XAxis, YAxis ,Bar, CartesianGrid } from 'recharts';

function App({ setValue }) {
  const [wordCounts, setWordCounts] = useState([]);

  function handleClick() {
    fetch('https://www.terriblytinytales.com/test.txt')
      .then(response => response.text())
      .then(data => {
        const words = data.toLowerCase().split(/[^\w']+/);
        const counts = {};
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (counts[word] === undefined) {
            counts[word] = 1;
          } else {
            counts[word]++;
          }
        }
        const sortedList = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 20);
        setWordCounts(sortedList);
        setValue(data); 
      })
      .catch(error => console.log('Error fetching data:', error));
  }

  function handleExportClick() {
  
    const Data = wordCounts.map(wordCount => `${wordCount[0]},${wordCount[1]}`).join('\n');
    
    const list = new Blob([Data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(list);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');
    link.click();
  }

  return (
    <div>
      <button onClick={handleClick}>Submit</button>
      {wordCounts.length > 0 && (
        <div>
          <h2>Highest Occuring 20 words list :-</h2>
          <BarChart width={800} height={600} data={wordCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="1" fill="#00ff00" />
          </BarChart>
          <button onClick={handleExportClick}>Export</button>
        </div>
      )}
    </div>
  );
}

export default App;
