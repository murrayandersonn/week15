import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useState } from 'react';

function App() {
  const API_URL='https://6679b67218a459f6395126c1.mockapi.io/api/laptime/cars';

  //setting state for our components
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ car: '', image: '', track: '', laptime: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  //renders again if theres an update
  useEffect(() => {
    fetchCars();
  }, []);

  //pull cars from API
  const fetchCars = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  //handles which type of submit it is. either editing current car or adding a new one
  const handleSubmit = (e) => {
    e.preventDefault();
    const carData = { ...newCar, imageUrl };

    if (editingCar) {
      updateCar(editingCar.id, carData);
    } else {
      createCar(carData);
    }
  };

  //Creation function for new car/lap time
  const createCar = (car) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    })
      .then(response => response.json())
      .then(() => {
        fetchCars();
        resetForm();
      })
      .catch(error => console.error('Error creating car:', error));
  };

  //resets the input fields after use
  const resetForm = () => {
    setNewCar({ car: '', track: 'Nürburgring', laptime: '' });
    setImageUrl('');
    setEditingCar(null);
  };

  //updates the car data and posts to the API
  const updateCar = (id, updatedCar) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCar),
    })
      .then(response => response.json())
      .then(() => {
        fetchCars();
        resetForm();
      })
      .catch(error => console.error('Error updating car:', error));
  };

  //delete car; removes from the API with a delete method
  const deleteCar = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchCars())
      .catch(error => console.error('Error deleting car:', error));
  };

  //sets the values in the form when we select the edit button
  const startEditing = (car) => {
    setEditingCar(car);
    setNewCar({
      car: car.car,
      track: 'Nürburgring',
      laptime: car.laptime
    });
    setImageUrl(car.imageUrl || '');
  };

  return (
    //card building and rendering, form on the bottom in the card-footer
    <div className="app">
      
      <div className="card nring-card">
        <div className="card-header">
          <h1>Nürburgring Lap Times</h1>
        </div>
        
        <div className="card-body">
          {cars.map(car => (
          <div key={car.car} className="card w-25">
            <div className='card-header'>
              <h2>{car.car}</h2> <p>Lap Time: {car.laptime}</p>
              <button className='btn btn-secondary' onClick={() => startEditing(car)}>Edit</button>
              <button className='btn btn-danger' onClick={() => deleteCar(car.id)}>Delete</button>
            </div>
            <div className='card-body img'>
              {car.imageUrl && <img src={car.imageUrl} alt={car.car} style={{ maxWidth: '100%' }} />}
              
            </div>
          </div>
          ))}
        </div>

        <div className="card-footer w-25">
          <div className='car-form'>
            <form onSubmit={handleSubmit}>
              <div className='form-control'>
                Car: <input
                  name="car"
                  value={newCar.car}
                  onChange={handleInputChange}
                  placeholder="Car Name"
                  required
                /> 
              </div>
              <div className='form-control'>
                Image: <input
                  name="imageUrl"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Image URL"
                  required
                />
              </div>
              <div className='form-control'>
                Track: <input 
                  name="track"
                  value="Nürburgring"
                  readOnly
                  placeholder="Track Name"
                  required
                />
              </div>
              <div className='form-control'>
                Laptime: <input
                  name="laptime"
                  value={newCar.laptime}
                  onChange={handleInputChange}
                  placeholder="Lap Time"
                  required
                />
              </div>
              <button className='btn btn-primary' type="submit">{editingCar ? 'Update' : 'Add'} Car</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
