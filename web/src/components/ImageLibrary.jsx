import { useState, useEffect, useCallback } from 'react';
import { X, Search, Trash2, Heart } from 'lucide-react';
import { useIndexedDB } from '../hooks/useLocalStorage';
import './ImageLibrary.css';

export const ImageLibrary = ({ onClose, onSelectImage }) => {
  const { getAllImages, deleteImage, updateImage } = useIndexedDB();
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites

  const loadImages = useCallback(async () => {
    try {
      const allImages = await getAllImages();
      setImages(allImages || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }, [getAllImages]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this image?')) {
      try {
        await deleteImage(id);
        loadImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleToggleFavorite = async (image, e) => {
    e.stopPropagation();
    try {
      await updateImage(image.id, { favorite: !image.favorite });
      loadImages();
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'favorites' && img.favorite);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="image-library">
      <div className="library-header">
        <h2>My Library</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="library-search">
        <div className="search-input">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="library-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            <Heart size={16} /> Favorites
          </button>
        </div>
      </div>

      <div className="library-grid">
        {filteredImages.length === 0 ? (
          <div className="library-empty">
            <p>No images found</p>
            <p className="empty-hint">Import an image to get started</p>
          </div>
        ) : (
          filteredImages.map((image) => (
            <div
              key={image.id}
              className="library-item"
              onClick={() => onSelectImage(image)}
            >
              <img src={image.url} alt={image.name} />
              <div className="item-actions">
                <button
                  className={`action-btn ${image.favorite ? 'favorite' : ''}`}
                  onClick={(e) => handleToggleFavorite(image, e)}
                  title="Favorite"
                >
                  <Heart size={16} fill={image.favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={(e) => handleDelete(image.id, e)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="item-info">
                <p className="item-name">{image.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
