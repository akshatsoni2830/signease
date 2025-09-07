import os
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

def load_custom_data(custom_dir="custom_store"):
    """Load custom sign data from the custom store"""
    custom_data = []
    custom_labels = []
    
    if not os.path.exists(custom_dir):
        print(f"Custom directory {custom_dir} not found")
        return [], []
    
    for filename in os.listdir(custom_dir):
        if filename.endswith('.json'):
            filepath = os.path.join(custom_dir, filename)
            try:
                with open(filepath, 'r') as f:
                    data = json.load(f)
                
                # Extract label from filename (e.g., "user123_HOW_ARE_YOU.json" -> "HOW_ARE_YOU")
                label = filename.split('_', 1)[1].replace('.json', '')
                
                # Add all samples for this label
                for sample in data.get('samples', []):
                    if len(sample) == 63:  # 21 landmarks * 3 coordinates
                        custom_data.append(sample)
                        custom_labels.append(label)
                        
            except Exception as e:
                print(f"Error loading {filename}: {e}")
    
    return np.array(custom_data), np.array(custom_labels)

def load_main_data(data_dir="processed"):
    """Load main training data"""
    try:
        X = np.load(os.path.join(data_dir, "X.npy"))
        y = np.load(os.path.join(data_dir, "y.npy"))
        return X, y
    except FileNotFoundError:
        print("Main training data not found")
        return np.array([]), np.array([])

def merge_datasets(main_X, main_y, custom_X, custom_y):
    """Merge main and custom datasets"""
    if len(main_X) == 0 and len(custom_X) == 0:
        print("No data to merge")
        return None, None, None
    
    if len(main_X) == 0:
        print("Only custom data available")
        X = custom_X
        y = custom_y
    elif len(custom_X) == 0:
        print("Only main data available")
        X = main_X
        y = main_y
    else:
        print("Merging main and custom data")
        X = np.vstack([main_X, custom_X])
        y = np.hstack([main_y, custom_y])
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    return X, y_encoded, label_encoder

def save_merged_data(X, y, label_encoder, output_dir="merged_data"):
    """Save merged dataset"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Save data
    np.save(os.path.join(output_dir, "X_merged.npy"), X)
    np.save(os.path.join(output_dir, "y_merged.npy"), y)
    
    # Save label encoder
    with open(os.path.join(output_dir, "label_encoder.pkl"), 'wb') as f:
        pickle.dump(label_encoder, f)
    
    # Save label mapping
    label_mapping = {i: label for i, label in enumerate(label_encoder.classes_)}
    with open(os.path.join(output_dir, "label_mapping.json"), 'w') as f:
        json.dump(label_mapping, f, indent=2)
    
    print(f"Saved merged dataset:")
    print(f"  - X shape: {X.shape}")
    print(f"  - y shape: {y.shape}")
    print(f"  - Unique labels: {len(label_encoder.classes_)}")
    print(f"  - Labels: {list(label_encoder.classes_)}")

def main():
    """Main function to merge custom and main datasets"""
    print("SignEase Dataset Merger")
    print("=" * 50)
    
    # Load data
    print("Loading main dataset...")
    main_X, main_y = load_main_data()
    if len(main_X) > 0:
        print(f"  Main dataset: {main_X.shape[0]} samples, {len(np.unique(main_y))} labels")
    
    print("Loading custom dataset...")
    custom_X, custom_y = load_custom_data()
    if len(custom_X) > 0:
        print(f"  Custom dataset: {custom_X.shape[0]} samples, {len(np.unique(custom_y))} labels")
    
    # Merge datasets
    X, y, label_encoder = merge_datasets(main_X, main_y, custom_X, custom_y)
    
    if X is not None:
        # Save merged dataset
        save_merged_data(X, y, label_encoder)
        
        # Optional: Split into train/test sets
        if len(X) > 100:  # Only split if we have enough data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            np.save("merged_data/X_train.npy", X_train)
            np.save("merged_data/X_test.npy", X_test)
            np.save("merged_data/y_train.npy", y_train)
            np.save("merged_data/y_test.npy", y_test)
            
            print(f"Train/Test split:")
            print(f"  - Train: {X_train.shape[0]} samples")
            print(f"  - Test: {X_test.shape[0]} samples")
    else:
        print("No data to process")

if __name__ == "__main__":
    main()
