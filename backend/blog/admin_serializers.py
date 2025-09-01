from rest_framework import serializers
from django.db import models
from .models import BlogPost, BlogImage, BlogDownload, Category
from .serializers import BlogImageSerializer, BlogDownloadSerializer


class AdminBlogPostSerializer(serializers.ModelSerializer):
    """Enhanced serializer for admin blog post operations - matches Django admin behavior"""
    author = serializers.StringRelatedField(read_only=True)
    excerpt = serializers.CharField(required=False, allow_blank=True)
    read_time = serializers.CharField(required=False, allow_blank=True)
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    download_count = serializers.ReadOnlyField()
    images = BlogImageSerializer(many=True, read_only=True)
    downloads = BlogDownloadSerializer(many=True, read_only=True)
    categories = serializers.SerializerMethodField(read_only=True)
    
    # Override category field to handle frontend-backend mismatch
    category = serializers.CharField(required=False, allow_blank=True)
    
    # Handle both image URL and image file like Django admin
    image = serializers.CharField(required=False, allow_blank=True)
    image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)
    
    # Handle tags as both list and string
    tags = serializers.JSONField(required=False)
    
    # Handle gallery images management (like Django admin inlines)
    gallery_images_to_delete = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of image IDs to delete from gallery"
    )
    
    # Handle remaining gallery images (for comparison)
    remaining_gallery_images = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
        help_text="List of remaining gallery images after frontend changes"
    )
    
    # Handle new gallery images upload (like Django admin inline extra forms)
    new_gallery_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="List of new image files to add to gallery"
    )

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author',
            'category', 'categories', 'tags', 'image', 'image_file', 'video_url', 
            'status', 'featured', 'read_time', 'views', 'like_count', 
            'comment_count', 'download_count', 'images', 'downloads',
            'created_at', 'updated_at', 'published_at', 'meta_description',
            'gallery_images_to_delete', 'remaining_gallery_images', 'new_gallery_images'
        ]
        read_only_fields = [
            'id', 'author', 'like_count', 'comment_count', 'download_count', 
            'views', 'images', 'downloads', 'created_at', 'updated_at', 'categories'
        ]

    def get_categories(self, obj):
        """Return empty list for categories (legacy field)"""
        return []

    def validate_category(self, value):
        """Validate and fix category values"""
        print(f"Validating category: '{value}'")
        
        if not value or value == '':
            print(f"Empty category, using 'other'")
            return 'other'
        
        # Fix common frontend-backend category mismatches
        category_mapping = {
            'web-development': 'web_development',
            'web_development': 'web_development',
            'case-study': 'case_study',
            'case_study': 'case_study',
            'industry-news': 'industry_news',
            'industry_news': 'industry_news',
            'business': 'business',
            'fintech': 'fintech',
            'technology': 'technology',
            'tutorial': 'tutorial',
            'other': 'other',
        }
        
        mapped_category = category_mapping.get(value, value)
        
        # Validate against actual choices
        valid_categories = [choice[0] for choice in BlogPost.CATEGORY_CHOICES]
        if mapped_category not in valid_categories:
            print(f"Invalid category '{value}' (mapped to '{mapped_category}'), using 'other'")
            return 'other'
        
        print(f"Category '{value}' mapped to '{mapped_category}'")
        return mapped_category

    def validate_image(self, value):
        """Validate image URL - allow empty strings and handle blob URLs"""
        print(f"Validating image: '{value}'")
        
        if value == '' or value is None:
            print(f"Empty image URL, allowing")
            return ''
        
        # Handle blob URLs (frontend temporary URLs)
        if value.startswith('blob:'):
            print(f"Blob URL detected: '{value}', setting to empty (will use image_file instead)")
            return ''
        
        # If it's a valid URL, return it
        if value.startswith(('http://', 'https://')):
            print(f"Valid image URL: '{value}'")
            return value
        
        print(f"Invalid image URL: '{value}', setting to empty")
        return ''

    def validate_image_file(self, value):
        """Validate image file - handle null/empty values and invalid objects"""
        print(f"Validating image_file: {type(value)} - {value}")
        
        # Handle various empty/invalid cases
        if value is None or value == '' or value == 'null' or value == '{}':
            print(f"Empty/null/invalid image_file, returning None")
            return None
        
        # Handle string representations of empty objects
        if isinstance(value, str) and value.strip() in ['{}', 'null', '']:
            print(f"String representation of empty object, returning None")
            return None
        
        # If it's a valid file object, return it
        if hasattr(value, 'read') and hasattr(value, 'name'):
            print(f"Valid image_file: {value.name}")
            return value
        
        print(f"Invalid image_file format, returning None")
        return None

    def validate_new_gallery_images(self, value):
        """Validate new gallery images"""
        if not value:
            return []
        
        print(f"Validating {len(value)} new gallery images")
        return value

    def validate_tags(self, value):
        """Ensure tags is always a list"""
        if isinstance(value, str):
            try:
                import json
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return [tag.strip() for tag in value.split(',') if tag.strip()]
        elif isinstance(value, list):
            return value
        else:
            return []

    def validate(self, data):
        """Custom validation for the entire serializer"""
        print(f"=== SERIALIZER VALIDATION DEBUG ===")
        print(f"Validation data keys: {list(data.keys())}")
        
        # Handle slug generation if not provided
        if not data.get('slug') and data.get('title'):
            from django.utils.text import slugify
            data['slug'] = slugify(data['title'])
            print(f"Generated slug: {data['slug']}")
        
        # Handle blob URL + image_file combination
        image_url = data.get('image', '')
        image_file = data.get('image_file')
        
        if image_url.startswith('blob:') and not image_file:
            print(f"⚠️  Blob URL detected without image_file - frontend should send actual file")
            data['image'] = ''
        
        return data

    def create(self, validated_data):
        print(f"=== SERIALIZER CREATE DEBUG ===")
        print(f"Create validated data keys: {list(validated_data.keys())}")
        
        # Handle featured image upload (like Django admin)
        image_file = validated_data.pop('image_file', None)
        gallery_images_to_delete = validated_data.pop('gallery_images_to_delete', [])
        remaining_gallery_images = validated_data.pop('remaining_gallery_images', [])
        new_gallery_images = validated_data.pop('new_gallery_images', [])
        
        if image_file:
            # Save the image file to the image_file field (Django will handle the upload)
            validated_data['image_file'] = image_file
            # Clear the image URL since we're using the file
            validated_data['image'] = ''
            print(f"Featured image file will be saved to media/blog/images/: {image_file.name}")
        
        try:
            instance = super().create(validated_data)
            print(f"✓ Blog post created successfully: {instance.title}")
            
            # Handle new gallery images upload (like Django admin inlines)
            if new_gallery_images:
                print(f"Creating {len(new_gallery_images)} new gallery images")
                for i, image_file in enumerate(new_gallery_images):
                    try:
                        # Create gallery image record (Django will handle file upload)
                        gallery_image = BlogImage.objects.create(
                            post=instance,
                            image=image_file,  # Django ImageField handles the upload
                            caption=f'Gallery image {i+1}',
                            order=i
                        )
                        print(f"✓ Created gallery image {i+1}: {gallery_image.image.url}")
                    except Exception as e:
                        print(f"❌ Gallery image {i+1} creation error: {e}")
            
            return instance
        except Exception as e:
            print(f"❌ Blog post creation failed: {e}")
            raise

    def update(self, instance, validated_data):
        print(f"=== SERIALIZER UPDATE DEBUG ===")
        print(f"Update validated data keys: {list(validated_data.keys())}")
        
        # Handle gallery images deletion (like Django admin inline deletion)
        gallery_images_to_delete = validated_data.pop('gallery_images_to_delete', [])
        remaining_gallery_images = validated_data.pop('remaining_gallery_images', [])
        new_gallery_images = validated_data.pop('new_gallery_images', [])
        
        print(f"Gallery images to delete: {gallery_images_to_delete}")
        print(f"Remaining gallery images: {len(remaining_gallery_images)} images")
        print(f"New gallery images to upload: {len(new_gallery_images)} files")
        
        # Handle gallery image deletion by comparing remaining vs current (like Django admin)
        if remaining_gallery_images is not None:
            current_images = list(instance.images.all())
            current_image_ids = set(img.id for img in current_images)
            remaining_image_ids = set()
            
            print(f"Current images in database: {len(current_images)}")
            for img in current_images:
                print(f"  - Image {img.id}: {img.image.url if img.image else img.image_url}")
            
            for img_data in remaining_gallery_images:
                if 'id' in img_data:
                    remaining_image_ids.add(img_data['id'])
                    print(f"  - Remaining image {img_data['id']}")
            
            # Images to delete are current images not in remaining images
            images_to_delete = current_image_ids - remaining_image_ids
            
            print(f"Current image IDs: {current_image_ids}")
            print(f"Remaining image IDs: {remaining_image_ids}")
            print(f"Detected images to delete: {images_to_delete}")
            
            if images_to_delete:
                # Delete the images (Django will handle file deletion)
                images_to_delete_objects = BlogImage.objects.filter(
                    post=instance,
                    id__in=images_to_delete
                )
                
                print(f"About to delete {images_to_delete_objects.count()} images")
                for img in images_to_delete_objects:
                    print(f"  - Deleting image {img.id}: {img.image.url if img.image else img.image_url}")
                    # Django will automatically delete the file when the model is deleted
                    if img.image:
                        img.image.delete(save=False)  # Delete the file
                
                deleted_count = images_to_delete_objects.delete()[0]
                print(f"✓ Successfully deleted {deleted_count} gallery images: {list(images_to_delete)}")
            else:
                print(f"No gallery images to delete")
        
        # Handle explicit gallery images deletion
        if gallery_images_to_delete:
            print(f"Explicit gallery images to delete: {gallery_images_to_delete}")
            images_to_delete_objects = BlogImage.objects.filter(
                post=instance,
                id__in=gallery_images_to_delete
            )
            
            for img in images_to_delete_objects:
                if img.image:
                    img.image.delete(save=False)  # Delete the file
            
            deleted_count = images_to_delete_objects.delete()[0]
            print(f"✓ Deleted {deleted_count} explicitly specified gallery images")
        
        # Handle new gallery images upload (like Django admin inline extra forms)
        if new_gallery_images:
            print(f"Creating {len(new_gallery_images)} new gallery images")
            current_max_order = instance.images.aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0
            
            for i, image_file in enumerate(new_gallery_images):
                try:
                    # Create gallery image record (Django will handle file upload)
                    gallery_image = BlogImage.objects.create(
                        post=instance,
                        image=image_file,  # Django ImageField handles the upload
                        caption=f'Gallery image {current_max_order + i + 1}',
                        order=current_max_order + i + 1
                    )
                    print(f"✓ Created new gallery image {i+1}: {gallery_image.image.url}")
                except Exception as e:
                    print(f"❌ New gallery image {i+1} creation error: {e}")
        
        # Handle featured image upload (like Django admin)
        image_file = validated_data.pop('image_file', None)
        if image_file:
            # Delete old featured image file if it exists
            if instance.image_file:
                instance.image_file.delete(save=False)
            
            # Save the new image file
            validated_data['image_file'] = image_file
            # Clear the image URL since we're using the file
            validated_data['image'] = ''
            print(f"New featured image file will be saved: {image_file.name}")
        
        # Handle image removal (if image field is explicitly set to empty)
        if 'image' in validated_data and validated_data['image'] == '':
            if instance.image_file:
                instance.image_file.delete(save=False)
                validated_data['image_file'] = None
            print(f"Featured image removed")
        
        # Log each field being updated
        for attr, value in validated_data.items():
            old_value = getattr(instance, attr, None)
            if old_value != value:
                print(f"Updating {attr}: '{old_value}' -> '{value}'")
                setattr(instance, attr, value)
            else:
                print(f"No change for {attr}: '{value}'")
        
        # Save the instance
        print(f"Saving instance...")
        instance.save()
        print(f"Instance saved successfully")
        
        return instance

    def to_representation(self, instance):
        """Customize the output representation"""
        data = super().to_representation(instance)
        
        # Ensure tags is always a list
        if not isinstance(data.get('tags'), list):
            data['tags'] = []
        
        # Use image_file URL if available, otherwise use image URL
        if instance.image_file:
            data['image'] = instance.image_file.url
        
        return data

    def to_internal_value(self, data):
        """Filter out read-only fields from incoming data and handle gallery images"""
        print(f"=== INCOMING DATA DEBUG ===")
        print(f"Raw data keys: {list(data.keys()) if hasattr(data, 'keys') else 'Not a dict'}")
        
        # Create a copy of data without read-only fields
        if hasattr(data, 'copy'):
            filtered_data = data.copy()
        else:
            filtered_data = dict(data)
        
        # Handle images field specially - convert to remaining_gallery_images
        if 'images' in filtered_data:
            images_data = filtered_data.get('images', [])
            print(f"Processing images data: {len(images_data)} images")
            
            # Convert images data to remaining_gallery_images format
            filtered_data['remaining_gallery_images'] = images_data
            
            # Remove the original images field
            filtered_data.pop('images')
            print(f"Converted images field to remaining_gallery_images")
        
        # Remove read-only fields that shouldn't be updated
        read_only_fields_to_remove = [
            'id', 'author', 'like_count', 'comment_count', 'download_count',
            'views', 'downloads', 'created_at', 'updated_at', 'categories'
        ]
        
        for field in read_only_fields_to_remove:
            if field in filtered_data:
                removed_value = filtered_data.pop(field)
                print(f"Removed read-only field '{field}': {type(removed_value).__name__}")
        
        print(f"Filtered data keys: {list(filtered_data.keys())}")
        
        try:
            result = super().to_internal_value(filtered_data)
            print(f"✓ Serializer validation passed")
            return result
        except Exception as e:
            print(f"❌ Serializer validation failed: {e}")
            raise


class AdminBlogImageSerializer(serializers.ModelSerializer):
    """Enhanced serializer for managing blog gallery images - matches Django admin inline behavior"""
    image_source = serializers.ReadOnlyField()
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = BlogImage
        fields = ['id', 'post', 'image', 'image_url', 'image_source', 'caption', 'order', 'image_file']

    def create(self, validated_data):
        print(f"=== GALLERY IMAGE CREATE DEBUG ===")
        image_file = validated_data.pop('image_file', None)
        
        if image_file:
            # Use the image_file for the image field (Django will handle upload)
            validated_data['image'] = image_file
            print(f"✓ Gallery image file will be saved to media/blog/images/: {image_file.name}")
        
        instance = super().create(validated_data)
        print(f"✓ Gallery image created: {instance.id} - {instance.image.url if instance.image else instance.image_url}")
        return instance

    def update(self, instance, validated_data):
        print(f"=== GALLERY IMAGE UPDATE DEBUG ===")
        image_file = validated_data.pop('image_file', None)
        
        if image_file:
            # Delete old image file if it exists
            if instance.image:
                instance.image.delete(save=False)
            
            # Use the image_file for the image field (Django will handle upload)
            validated_data['image'] = image_file
            print(f"✓ Gallery image file will be updated: {image_file.name}")
        
        instance = super().update(instance, validated_data)
        print(f"✓ Gallery image updated: {instance.id} - {instance.image.url if instance.image else instance.image_url}")
        return instance