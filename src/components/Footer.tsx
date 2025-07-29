export const Footer = () => {
  return (
    <footer className="mt-16 py-8 border-t border-border bg-background/50">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <span>©</span>
            <a 
              href="https://lazukcorp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              LAZUK CORP
            </a>
            <span>|</span>
            <a 
              href="https://lazukhasan.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              LAZUK HASAN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};