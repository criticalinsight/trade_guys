# Finds images in markdown files and replace them with a cloudinary responsive image include
Jekyll::Hooks.register :documents, :pre_render do |post, payload|
  docExt = post.extname.tr('.', '')
  # only process if we deal with a markdown file
  if payload['site']['markdown_ext'].include? docExt

    newContent = post.content.gsub(/\!\[(.*)?\]\((.*?)(?=\"|\'|\))((?:\"|\').*(?:\"|\'))?\)/) do |str|

      attributes = { 'alt' => nil, 'path' => nil, 'title' => nil }

      attributes['alt'],attributes['path'],attributes['title'] = str.match(/\!\[(.*)?\]\((.*?)(?=\"|\'|\))((?:\"|\').*(?:\"|\'))?\)/).captures

      attributes.each do |key,value|
        attributes[key] = value && value.length > 0 ? "'#{value}'" : '""'
      end

       "{% include cloudinary-responsive-img.html title=#{attributes['title']} alt=#{attributes['alt']} path=#{attributes['path']} %}"

    end

    post.content = newContent


  end
end
